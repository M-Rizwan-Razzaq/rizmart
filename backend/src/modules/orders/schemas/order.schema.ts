import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  PACKED = "Packed",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  RETURNED = "Returned",
}

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: "Product" })
  product: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  qty: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
class ShippingAddress {
  @Prop() name?: string;
  @Prop() firstName?: string;
  @Prop() lastName?: string;
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) city: string;
  @Prop() state?: string;
  @Prop({ required: true }) zip: string;
  @Prop({ required: true }) country: string;
}

const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, uppercase: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user: Types.ObjectId;

  @Prop({ lowercase: true, trim: true })
  guestEmail: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0, default: 0 })
  shipping: number;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop()
  phone: string;

  @Prop()
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
OrderSchema.set("toJSON", { virtuals: true });
