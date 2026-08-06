import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Review, ReviewDocument } from "./schemas/review.schema";
import { Product, ProductDocument } from "../products/schemas/product.schema";
import { CreateReviewDto, UpdateReviewDto } from "./dto/create-review.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";

@Injectable()
export class ReviewsService implements OnModuleInit {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    try {
      await this.reviewModel.syncIndexes();
    } catch (error) {
      this.logger.warn(
        `Unable to sync review indexes: ${(error as Error).message}`,
      );
    }
  }

  async findByProduct(
    productId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<ReviewDocument>> {
    const filter = { product: new Types.ObjectId(productId) };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.reviewModel.countDocuments(filter),
    ]);
    return {
      data: data as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(
    dto: CreateReviewDto,
    currentUser?: { userId?: string; role?: string; name?: string } | null,
  ): Promise<ReviewDocument> {
    const productExists = await this.productModel.findById(dto.productId);
    if (!productExists) throw new NotFoundException("Product not found");

    const displayName =
      dto.displayName?.trim() || currentUser?.name?.trim() || "Guest";

    const review = new this.reviewModel({
      product: new Types.ObjectId(dto.productId),
      ...(currentUser?.userId
        ? { user: new Types.ObjectId(currentUser.userId) }
        : {}),
      rating: dto.rating,
      comment: dto.comment,
      displayName,
    });

    const saved = await review.save();
    await this.recalculateRating(dto.productId);
    return saved;
  }

  async update(
    id: string,
    userId: string,
    userRole: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException("Review not found");

    if (
      userRole !== "admin" &&
      (!review.user || review.user.toString() !== userId)
    ) {
      throw new ForbiddenException("You can only update your own reviews");
    }

    const updated = await this.reviewModel
      .findByIdAndUpdate(
        id,
        {
          rating: dto.rating,
          comment: dto.comment,
          ...(dto.displayName !== undefined
            ? { displayName: dto.displayName.trim() }
            : {}),
        },
        { new: true },
      )
      .populate("user", "name avatar")
      .lean()
      .exec();

    await this.recalculateRating(review.product.toString());
    return updated as any;
  }

  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<{ message: string }> {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException("Review not found");

    if (
      userRole !== "admin" &&
      (!review.user || review.user.toString() !== userId)
    ) {
      throw new ForbiddenException("You can only delete your own reviews");
    }

    const productId = review.product.toString();
    await this.reviewModel.findByIdAndDelete(id);
    await this.recalculateRating(productId);
    return { message: "Review deleted" };
  }

  private async recalculateRating(productId: string): Promise<void> {
    const result = await this.reviewModel.aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const avg = result[0]?.avg ?? 0;
    const count = result[0]?.count ?? 0;
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: count,
    });
  }
}
