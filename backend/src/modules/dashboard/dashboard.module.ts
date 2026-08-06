import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { Order, OrderSchema } from "../orders/schemas/order.schema";
import { Product, ProductSchema } from "../products/schemas/product.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { Review, ReviewSchema } from "../reviews/schemas/review.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
