import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProductDocument = Product & Document;

export enum ProductGender {
  MEN = "men",
  WOMEN = "women",
  UNISEX = "unisex",
}

export enum ProductMaterial {
  LEATHER = "leather",
  FAUX_LEATHER = "faux-leather",
  CANVAS = "canvas",
  NYLON = "nylon",
  POLYESTER = "polyester",
  SUEDE = "suede",
  VEGAN_LEATHER = "vegan-leather",
  // Legacy materials kept for compatibility with existing records.
  GOLD = "gold",
  SILVER = "silver",
  ROSE_GOLD = "rose-gold",
  BLACK = "black",
}

export enum ProductStyle {
  LUXURY = "luxury",
  MINIMAL = "minimal",
  VINTAGE = "vintage",
  GOTH = "goth",
  CASUAL = "casual",
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  discountPrice: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId;

  @Prop({ type: String, enum: ProductGender, required: true })
  gender: ProductGender;

  @Prop({ type: String, enum: ProductMaterial, required: true })
  material: ProductMaterial;

  @Prop({ type: String, enum: ProductStyle, required: true })
  style: ProductStyle;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  sku: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Map, of: String, default: {} })
  specifications: Map<string, string>;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: false })
  trending: boolean;

  @Prop({ default: false })
  bestSeller: boolean;

  @Prop({ default: false })
  newArrival: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ default: 0, min: 0 })
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ category: 1 });
ProductSchema.index({ gender: 1 });
ProductSchema.index({ material: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });

ProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
ProductSchema.set("toJSON", { virtuals: true });
