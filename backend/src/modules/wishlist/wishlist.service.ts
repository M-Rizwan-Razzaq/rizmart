import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Wishlist, WishlistDocument } from "./schemas/wishlist.schema";

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) {}

  async getWishlist(userId: string): Promise<WishlistDocument> {
    const wishlist = await this.wishlistModel
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $setOnInsert: { user: new Types.ObjectId(userId), products: [] } },
        { upsert: true, new: true },
      )
      .populate(
        "products",
        "name slug price discountPrice images averageRating",
      )
      .lean()
      .exec();
    return wishlist as any;
  }

  async toggle(userId: string, productId: string): Promise<WishlistDocument> {
    const productOid = new Types.ObjectId(productId);
    const existing = await this.wishlistModel.findOne({
      user: new Types.ObjectId(userId),
      products: productOid,
    });

    const update = existing
      ? { $pull: { products: productOid } }
      : { $addToSet: { products: productOid } };

    const wishlist = await this.wishlistModel
      .findOneAndUpdate({ user: new Types.ObjectId(userId) }, update, {
        upsert: true,
        new: true,
      })
      .populate(
        "products",
        "name slug price discountPrice images averageRating",
      )
      .lean()
      .exec();

    return wishlist as any;
  }

  async clear(userId: string): Promise<{ message: string }> {
    await this.wishlistModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { products: [] },
      { upsert: true },
    );
    return { message: "Wishlist cleared" };
  }
}
