import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  product: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  user?: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, minlength: 10, maxlength: 500 })
  comment: string;

  @Prop({ trim: true, minlength: 2, maxlength: 60 })
  displayName?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ product: 1, createdAt: -1 });

ReviewSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
ReviewSchema.set("toJSON", { virtuals: true });
