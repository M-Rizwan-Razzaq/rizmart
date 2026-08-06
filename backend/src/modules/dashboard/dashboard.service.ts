import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Order,
  OrderDocument,
  OrderStatus,
} from "../orders/schemas/order.schema";
import { Product, ProductDocument } from "../products/schemas/product.schema";
import { User, UserDocument } from "../users/schemas/user.schema";
import { Review, ReviewDocument } from "../reviews/schemas/review.schema";

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async getStats() {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueAgg,
      ordersByStatusAgg,
      recentOrders,
      topProducts,
      revenueByMonthAgg,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.productModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({ role: "customer" }),

      // Total revenue from delivered orders
      this.orderModel.aggregate([
        { $match: { status: OrderStatus.DELIVERED } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Orders grouped by status
      this.orderModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Last 5 orders
      this.orderModel
        .find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec(),

      // Top 5 products by review count
      this.productModel
        .find({ isActive: true })
        .sort({ reviewCount: -1, averageRating: -1 })
        .limit(5)
        .select("name slug images price averageRating reviewCount stock")
        .lean()
        .exec(),

      // Revenue per month for last 6 months
      this.orderModel.aggregate([
        {
          $match: {
            status: OrderStatus.DELIVERED,
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const ordersByStatus = ordersByStatusAgg.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      {} as Record<string, number>,
    );

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const revenueByMonth = revenueByMonthAgg.map(
      ({ _id, revenue, orders }) => ({
        month: monthNames[_id.month - 1],
        revenue,
        orders,
      }),
    );

    return {
      totalRevenue: revenueAgg[0]?.total ?? 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      ordersByStatus,
      revenueByMonth,
      recentOrders,
      topProducts,
    };
  }
}
