import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  NewsletterSubscription,
  NewsletterSubscriptionDocument,
} from "./schemas/newsletter-subscription.schema";
import { CreateNewsletterSubscriptionDto } from "./dto/create-newsletter-subscription.dto";

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(NewsletterSubscription.name)
    private readonly subscriptionModel: Model<NewsletterSubscriptionDocument>,
  ) {}

  async subscribe(
    dto: CreateNewsletterSubscriptionDto,
  ): Promise<{ subscribed: boolean; alreadySubscribed?: boolean }> {
    const email = dto.email.trim().toLowerCase();
    if (!email) throw new BadRequestException("Email is required");

    const existing = await this.subscriptionModel
      .findOne({ email })
      .lean()
      .exec();
    if (existing) return { subscribed: false, alreadySubscribed: true };

    await this.subscriptionModel.create({ email, isActive: true });

    return { subscribed: true };
  }
}
