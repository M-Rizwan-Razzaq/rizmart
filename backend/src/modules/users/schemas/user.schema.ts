import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as bcrypt from "bcrypt";

export type UserDocument = User & Document;

export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

@Schema({ _id: true })
export class Address {
  _id: Types.ObjectId;

  @Prop({ trim: true, default: "" })
  label: string; // "Home", "Work", etc.

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ trim: true, default: "" })
  lastName: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ trim: true, default: "" })
  state: string;

  @Prop({ trim: true, default: "" })
  zip: string;

  @Prop({ required: true, trim: true, default: "United States" })
  country: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ default: false })
  isDefault: boolean;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Prop({ trim: true })
  phone: string;

  @Prop()
  avatar: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });
