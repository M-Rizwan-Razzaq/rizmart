import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, User, UserDocument } from "../users/schemas/user.schema";
import { Order, OrderDocument } from "../orders/schemas/order.schema";
import {
  NewsletterSubscription,
  NewsletterSubscriptionDocument,
} from "../newsletter/schemas/newsletter-subscription.schema";
import { SendPromotionDto } from "./dto/send-promotion.dto";
import { NotificationService } from "../../common/services/notification.service";

type RecipientSummary = {
  totalUniqueRecipients: number;
  userEmails: number;
  orderEmails: number;
  newsletterEmails: number;
  duplicateEmails: number;
};

@Injectable()
export class MarketingService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(NewsletterSubscription.name)
    private readonly newsletterModel: Model<NewsletterSubscriptionDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async getRecipientSummary(): Promise<RecipientSummary> {
    const recipients = await this.collectRecipients();
    return {
      totalUniqueRecipients: recipients.uniqueEmails.length,
      userEmails: recipients.userEmails.length,
      orderEmails: recipients.orderEmails.length,
      newsletterEmails: recipients.newsletterEmails.length,
      duplicateEmails: recipients.duplicateEmails,
    };
  }

  async sendPromotion(
    dto: SendPromotionDto,
  ): Promise<RecipientSummary & { sent: number }> {
    const recipients = await this.collectRecipients();
    await Promise.allSettled(
      recipients.uniqueEmails.map((email) =>
        this.notificationService.sendPromotionEmail(email, {
          subject: dto.subject.trim(),
          message: dto.message.trim(),
        }),
      ),
    );

    return {
      totalUniqueRecipients: recipients.uniqueEmails.length,
      userEmails: recipients.userEmails.length,
      orderEmails: recipients.orderEmails.length,
      newsletterEmails: recipients.newsletterEmails.length,
      duplicateEmails: recipients.duplicateEmails,
      sent: recipients.uniqueEmails.length,
    };
  }

  private async collectRecipients(): Promise<{
    uniqueEmails: string[];
    userEmails: string[];
    orderEmails: string[];
    newsletterEmails: string[];
    duplicateEmails: number;
  }> {
    const [
      userEmailsRaw,
      orderUsers,
      orderGuestEmailsRaw,
      newsletterEmailsRaw,
    ] = await Promise.all([
      this.userModel
        .find({ role: Role.CUSTOMER, isBlocked: { $ne: true } })
        .select("email")
        .lean()
        .exec(),
      this.orderModel
        .find()
        .select("user guestEmail")
        .populate("user", "email")
        .lean()
        .exec(),
      this.orderModel.distinct("guestEmail").exec(),
      this.newsletterModel
        .find({ isActive: true })
        .select("email")
        .lean()
        .exec(),
    ]);

    const userEmails = userEmailsRaw
      .map((user) => user.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));

    const orderEmails = [
      ...orderUsers.map((order) =>
        typeof order.user === "object" && order.user && "email" in order.user
          ? (order.user as { email?: string }).email?.trim().toLowerCase()
          : undefined,
      ),
      ...orderGuestEmailsRaw
        .map((email) =>
          typeof email === "string" ? email.trim().toLowerCase() : "",
        )
        .filter(Boolean),
    ].filter((email): email is string => Boolean(email));

    const newsletterEmails = newsletterEmailsRaw
      .map((sub) => sub.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));

    const unique = new Set<string>();
    let duplicateEmails = 0;
    for (const email of [...userEmails, ...orderEmails, ...newsletterEmails]) {
      if (unique.has(email)) duplicateEmails += 1;
      unique.add(email);
    }

    return {
      uniqueEmails: Array.from(unique),
      userEmails,
      orderEmails,
      newsletterEmails,
      duplicateEmails,
    };
  }
}
