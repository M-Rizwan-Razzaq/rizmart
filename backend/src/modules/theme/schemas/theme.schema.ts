import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ThemeDocument = ThemeSettings & Document;

@Schema({ timestamps: true })
export class ThemeSettings {
  @Prop({ required: true, default: "global", unique: true })
  key: string;

  @Prop({ required: false })
  background?: string;
  @Prop({ required: false })
  foreground?: string;
  @Prop({ required: false })
  card?: string;
  @Prop({ required: false })
  cardForeground?: string;
  @Prop({ required: false })
  popover?: string;
  @Prop({ required: false })
  popoverForeground?: string;
  @Prop({ required: false })
  primary?: string;
  @Prop({ required: false })
  primaryForeground?: string;
  @Prop({ required: false })
  secondary?: string;
  @Prop({ required: false })
  secondaryForeground?: string;
  @Prop({ required: false })
  muted?: string;
  @Prop({ required: false })
  mutedForeground?: string;
  @Prop({ required: false })
  accent?: string;
  @Prop({ required: false })
  accentForeground?: string;
  @Prop({ required: false })
  destructive?: string;
  @Prop({ required: false })
  destructiveForeground?: string;
  @Prop({ required: false })
  border?: string;
  @Prop({ required: false })
  input?: string;
  @Prop({ required: false })
  ring?: string;
  @Prop({ required: false })
  gold?: string;
  @Prop({ required: false })
  goldSoft?: string;
  @Prop({ required: false })
  goldDark?: string;
  @Prop({ required: false })
  ivory?: string;
  @Prop({ required: false })
  onyx?: string;
  @Prop({ required: false })
  sidebar?: string;
  @Prop({ required: false })
  sidebarForeground?: string;
  @Prop({ required: false })
  sidebarPrimary?: string;
  @Prop({ required: false })
  sidebarPrimaryForeground?: string;
  @Prop({ required: false })
  sidebarAccent?: string;
  @Prop({ required: false })
  sidebarAccentForeground?: string;
  @Prop({ required: false })
  sidebarBorder?: string;
  @Prop({ required: false })
  sidebarRing?: string;
  @Prop({ required: false })
  iconColor?: string;
  @Prop({ required: false })
  displayFont?: string;
  @Prop({ required: false })
  bodyFont?: string;
  @Prop({ required: false })
  buttonGradientStart?: string;
  @Prop({ required: false })
  buttonGradientEnd?: string;
  @Prop({ required: false })
  buttonForeground?: string;
}

export const ThemeSettingsSchema = SchemaFactory.createForClass(ThemeSettings);
