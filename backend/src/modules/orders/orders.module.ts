import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { Order, OrderSchema } from "./schemas/order.schema";
import { Product, ProductSchema } from "../products/schemas/product.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { NotificationService } from "../../common/services/notification.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, NotificationService],
  exports: [OrdersService],
})
export class OrdersModule {}
