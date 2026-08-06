import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NewsletterSubscriptionDocument = NewsletterSubscription & Document;

@Schema({ timestamps: true })
export class NewsletterSubscription {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const NewsletterSubscriptionSchema = SchemaFactory.createForClass(
  NewsletterSubscription,
);

NewsletterSubscriptionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
NewsletterSubscriptionSchema.set("toJSON", { virtuals: true });
