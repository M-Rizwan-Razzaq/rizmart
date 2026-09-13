import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BrandSettingsDocument = BrandSettings & Document;

@Schema({ timestamps: true })
export class BrandSettings {
  @Prop({ required: true, default: "global", unique: true })
  key: string;

  @Prop({ required: false, default: "RizMart" })
  appName?: string;

  @Prop({ required: false, default: "rizmart.pk@gmail.com" })
  contactEmail?: string;

  @Prop({ required: false, default: "+92 318 6592403" })
  contactPhone?: string;

  @Prop({ required: false, default: "Karachi, Pakistan" })
  atelier?: string;

  @Prop({ required: false, default: "" })
  homeMainImage?: string;

  @Prop({ required: false, default: "" })
  homeCategoryImageRings?: string;

  @Prop({ required: false, default: "" })
  homeCategoryImageNecklaces?: string;

  @Prop({ required: false, default: "" })
  homeCategoryImageBraceletes?: string;

  @Prop({ required: false, default: "" })
  homeCategoryImageEarrings?: string;

  @Prop({ required: false, default: "" })
  aboutUsImage?: string;
}

export const BrandSettingsSchema = SchemaFactory.createForClass(BrandSettings);
