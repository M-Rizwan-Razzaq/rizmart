import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SiteContentDocument = SiteContent & Document;

@Schema({ timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contentHtml: string;
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
