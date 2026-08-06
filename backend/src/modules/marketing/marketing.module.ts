import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationService } from "../../common/services/notification.service";
import { Order, OrderSchema } from "../orders/schemas/order.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import {
  NewsletterSubscription,
  NewsletterSubscriptionSchema,
} from "../newsletter/schemas/newsletter-subscription.schema";
import { MarketingController } from "./marketing.controller";
import { MarketingService } from "./marketing.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      {
        name: NewsletterSubscription.name,
        schema: NewsletterSubscriptionSchema,
      },
    ]),
  ],
  controllers: [MarketingController],
  providers: [MarketingService, NotificationService],
})
export class MarketingModule {}
