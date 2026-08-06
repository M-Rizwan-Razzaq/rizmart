import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Model, Types } from "mongoose";
import { Order, OrderDocument, OrderStatus } from "./schemas/order.schema";
import { Product, ProductDocument } from "../products/schemas/product.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { User, UserDocument } from "../users/schemas/user.schema";
import { NotificationService } from "../../common/services/notification.service";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateOrderDto, userId?: string): Promise<OrderDocument> {
    if (!userId && !dto.guestEmail) {
      throw new BadRequestException("Guest email is required for guest orders");
    }

    // Validate products and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of dto.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product || !product.isActive) {
        throw new NotFoundException(`Product "${item.productId}" not found`);
      }
      if (product.stock < item.qty) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}" (available: ${product.stock})`,
        );
      }
      const price = product.discountPrice ?? product.price;
      orderItems.push({
        product: new Types.ObjectId(item.productId),
        name: product.name,
        image: product.images[0] ?? "",
        price,
        qty: item.qty,
      });
      subtotal += price * item.qty;
    }

    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + shipping;
    const orderNumber = await this.generateOrderNumber();

    const order = new this.orderModel({
      orderNumber,
      user: userId ? new Types.ObjectId(userId) : undefined,
      guestEmail: dto.guestEmail,
      items: orderItems,
      subtotal,
      shipping,
      total,
      shippingAddress: dto.shippingAddress,
      phone: dto.phone,
      notes: dto.notes,
    });

    const saved = await order.save();

    // Reduce stock
    for (const item of dto.items) {
      await this.productModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty },
      });
    }

    const [customerEmail, adminEmail] = await Promise.all([
      this.resolveCustomerEmail(saved, userId, dto.guestEmail),
      Promise.resolve(
        this.configService.get<string>("notifications.adminEmail"),
      ),
    ]);

    await this.safeNotify(() =>
      this.notificationService.notifyOrderPlaced(
        this.serializeOrder(saved),
        customerEmail,
        adminEmail,
      ),
    );

    return saved;
  }

  async createManual(dto: CreateOrderDto): Promise<OrderDocument> {
    return this.create(dto);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: OrderStatus,
    search?: string,
  ): Promise<PaginatedResponse<OrderDocument>> {
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      data: data as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(
    userId: string,
    page = 1,
    limit = 10,
    email?: string,
  ): Promise<PaginatedResponse<OrderDocument>> {
    const filter: any = { $or: [{ user: new Types.ObjectId(userId) }] };
    if (email) {
      filter.$or.push({
        guestEmail: { $regex: new RegExp(`^${email}$`, "i") },
      });
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter),
    ]);
    return {
      data: data as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate("user", "name email")
      .lean()
      .exec();
    if (!order) throw new NotFoundException(`Order "${id}" not found`);
    return order as any;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({ orderNumber: orderNumber.toUpperCase() })
      .populate("user", "name email")
      .lean()
      .exec();
    if (!order) throw new NotFoundException(`Order "${orderNumber}" not found`);
    return order as any;
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderDocument> {
    const existing = await this.findById(id);
    if (existing.status === dto.status) {
      return existing;
    }

    const updated = await this.orderModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .lean()
      .exec();

    const recipientEmail = await this.resolveOrderRecipientEmail(existing);
    await this.safeNotify(() =>
      this.notificationService.notifyOrderStatusChanged(
        this.serializeOrder(updated as any),
        existing.status,
        dto.status,
        recipientEmail,
      ),
    );

    return updated as any;
  }

  async cancel(id: string, userId: string): Promise<OrderDocument> {
    const order = await this.findById(id);

    const ownerId =
      (order.user as any)?._id?.toString() ?? (order.user as any)?.toString();
    if (ownerId !== userId) {
      throw new ForbiddenException("You can only cancel your own orders");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("Only pending orders can be cancelled");
    }

    // Restore stock
    for (const item of order.items as any[]) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    const updated = await this.orderModel
      .findByIdAndUpdate(id, { status: OrderStatus.CANCELLED }, { new: true })
      .lean()
      .exec();

    const recipientEmail = await this.resolveOrderRecipientEmail(order);
    await this.safeNotify(() =>
      this.notificationService.notifyOrderStatusChanged(
        this.serializeOrder(updated as any),
        order.status,
        OrderStatus.CANCELLED,
        recipientEmail,
      ),
    );

    return updated as any;
  }

  async delete(id: string): Promise<OrderDocument> {
    const order = await this.findById(id);

    // Restore stock for the removed order so inventory stays accurate.
    for (const item of order.items as any[]) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    const deleted = await this.orderModel.findByIdAndDelete(id).lean().exec();
    return deleted as any;
  }

  /**
   * After a guest registers, assign all their guest orders to their new account.
   * Matches on guestEmail (case-insensitive) where user field is not set.
   */
  async claimGuestOrders(email: string, userId: string): Promise<number> {
    const result = await this.orderModel.updateMany(
      {
        guestEmail: { $regex: new RegExp(`^${email}$`, "i") },
        user: { $exists: false },
      },
      {
        $set: { user: new Types.ObjectId(userId) },
        $unset: { guestEmail: "" },
      },
    );
    return result.modifiedCount;
  }

  private async generateOrderNumber(): Promise<string> {
    while (true) {
      const num = `LX-${Math.floor(10000 + Math.random() * 90000)}`;
      const exists = await this.orderModel.findOne({ orderNumber: num });
      if (!exists) return num;
    }
  }

  private async resolveCustomerEmail(
    order: OrderDocument,
    userId?: string,
    guestEmail?: string,
  ): Promise<string | null> {
    if (userId) {
      const user = await this.userModel
        .findById(userId)
        .select("email")
        .lean()
        .exec();
      return user?.email ?? guestEmail?.toLowerCase?.() ?? null;
    }

    return (
      guestEmail?.toLowerCase?.() ??
      (order.guestEmail as string | undefined) ??
      null
    );
  }

  private async resolveOrderRecipientEmail(
    order: OrderDocument,
  ): Promise<string | null> {
    const populatedUser = order.user as any;
    if (populatedUser?.email) {
      return populatedUser.email;
    }

    const userId =
      populatedUser?._id?.toString?.() ?? populatedUser?.toString?.();
    if (userId) {
      const user = await this.userModel
        .findById(userId)
        .select("email")
        .lean()
        .exec();
      if (user?.email) {
        return user.email;
      }
    }

    return order.guestEmail ?? null;
  }

  private serializeOrder(order: any): any {
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      shipping: order.shipping,
      subtotal: order.subtotal,
      phone: order.phone,
      guestEmail: order.guestEmail,
      shippingAddress: order.shippingAddress,
      items: (order.items ?? []).map((item: any) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      user: order.user
        ? {
            name: order.user.name,
            email: order.user.email,
          }
        : undefined,
    };
  }

  private async safeNotify(action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch (error) {
      this.logger.warn(
        `Notification dispatch failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
