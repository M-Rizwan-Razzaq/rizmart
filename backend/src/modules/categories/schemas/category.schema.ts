import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoryDocument = Category & Document;

export enum Gender {
  MEN = "men",
  WOMEN = "women",
  UNISEX = "unisex",
}

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @Prop()
  image: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
CategorySchema.set("toJSON", { virtuals: true });
