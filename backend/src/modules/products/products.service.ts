import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import slugify from "slugify";
import { Product, ProductDocument } from "./schemas/product.schema";
import {
  Category,
  CategoryDocument,
} from "../categories/schemas/category.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto, SortBy } from "./dto/product-query.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { UploadsService } from "../uploads/uploads.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(
    query: ProductQueryDto,
  ): Promise<PaginatedResponse<ProductDocument>> {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      gender,
      material,
      style,
      minPrice,
      maxPrice,
      featured,
      trending,
      bestSeller,
      newArrival,
      sortBy = SortBy.NEWEST,
    } = query;

    const filter: any = query.includeInactive ? {} : { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (category) {
      const resolvedCategory = await this.categoryModel
        .findOne(
          Types.ObjectId.isValid(category)
            ? { _id: new Types.ObjectId(category) }
            : { slug: category },
        )
        .select("_id")
        .lean()
        .exec();

      if (!resolvedCategory)
        return { data: [], total: 0, page, limit, totalPages: 0 };

      filter.category = {
        $in: [resolvedCategory._id, resolvedCategory._id.toHexString()],
      };
    }
    if (gender) filter.gender = gender;
    if (material) filter.material = material;
    if (style) filter.style = style;
    if (featured === true) filter.featured = true;
    if (trending === true) filter.trending = true;
    if (bestSeller === true) filter.bestSeller = true;
    if (newArrival === true) filter.newArrival = true;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sortMap: Record<SortBy, any> = {
      [SortBy.PRICE_ASC]: { price: 1 },
      [SortBy.PRICE_DESC]: { price: -1 },
      [SortBy.RATING]: { averageRating: -1 },
      [SortBy.NEWEST]: { createdAt: -1 },
      [SortBy.POPULAR]: { reviewCount: -1 },
    };
    const sort = sortMap[sortBy] ?? { createdAt: -1 };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate("category", "name slug gender")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      data: data as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate("category", "name slug gender")
      .lean()
      .exec();
    if (!product) throw new NotFoundException(`Product "${id}" not found`);
    return product as any;
  }

  async findBySlug(slug: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({ slug, isActive: true })
      .populate("category", "name slug gender")
      .lean()
      .exec();
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product as any;
  }

  async findFeatured(): Promise<any[]> {
    return this.productModel
      .find({ featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
      .exec() as any;
  }

  async findTrending(): Promise<any[]> {
    return this.productModel
      .find({ trending: true, isActive: true })
      .limit(8)
      .lean()
      .exec() as any;
  }

  async findBestSellers(): Promise<any[]> {
    return this.productModel
      .find({ bestSeller: true, isActive: true })
      .limit(8)
      .lean()
      .exec() as any;
  }

  async findNewArrivals(): Promise<any[]> {
    return this.productModel
      .find({ newArrival: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
      .exec() as any;
  }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    // Check for duplicate SKU upfront with a clear error
    const existingSku = await this.productModel.findOne({
      sku: dto.sku.toUpperCase(),
    });
    if (existingSku) {
      throw new ConflictException(
        `A product with SKU "${dto.sku}" already exists`,
      );
    }

    const slug = await this.generateUniqueSlug(dto.name);
    const created = new this.productModel({ ...dto, slug });

    try {
      return await created.save();
    } catch (err: any) {
      // Catch MongoDB duplicate key error for any other unique field
      if (err?.code === 11000) {
        const field = Object.keys(err?.keyPattern ?? {})[0] ?? "field";
        throw new ConflictException(
          `Duplicate value: a product with this ${field} already exists`,
        );
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    await this.findById(id);
    const updateData: any = { ...dto };
    if (dto.name) {
      updateData.slug = await this.generateUniqueSlug(dto.name, id);
    }
    // Check duplicate SKU on update (excluding self)
    if (dto.sku) {
      const existing = await this.productModel.findOne({
        sku: dto.sku.toUpperCase(),
        _id: { $ne: id },
      });
      if (existing) {
        throw new ConflictException(
          `A product with SKU "${dto.sku}" already exists`,
        );
      }
    }
    try {
      const updated = await this.productModel
        .findByIdAndUpdate(id, { $set: updateData }, { new: true })
        .populate("category", "name slug gender")
        .lean()
        .exec();
      return updated as any;
    } catch (err: any) {
      if (err?.code === 11000) {
        const field = Object.keys(err?.keyPattern ?? {})[0] ?? "field";
        throw new ConflictException(
          `Duplicate value: a product with this ${field} already exists`,
        );
      }
      throw err;
    }
  }

  async addImages(id: string, imageUrls: string[]): Promise<ProductDocument> {
    await this.findById(id);
    const updated = await this.productModel
      .findByIdAndUpdate(
        id,
        { $push: { images: { $each: imageUrls } } },
        { new: true },
      )
      .lean()
      .exec();
    return updated as any;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.productModel.findByIdAndDelete(id);
    return { message: "Product removed successfully" };
  }

  async updateStock(id: string, quantitySold: number): Promise<void> {
    await this.productModel.findByIdAndUpdate(id, {
      $inc: { stock: -quantitySold },
    });
  }

  async updateRating(productId: string): Promise<void> {
    // Called by ReviewsService after create/update/delete
    const result = await (
      this.productModel.db.model("Review") as any
    ).aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const avg = result[0]?.avg ?? 0;
    const count = result[0]?.count ?? 0;
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: count,
    });
  }

  private async generateUniqueSlug(
    name: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(name, { lower: true, strict: true });
    let slug = base;
    let i = 1;
    while (true) {
      const filter: any = { slug };
      if (excludeId) filter._id = { $ne: excludeId };
      const exists = await this.productModel.findOne(filter);
      if (!exists) return slug;
      slug = `${base}-${i++}`;
    }
  }
}
