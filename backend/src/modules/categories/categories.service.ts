import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { Category, CategoryDocument } from "./schemas/category.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(includeInactive = false): Promise<CategoryDocument[]> {
    const filter = includeInactive ? {} : { isActive: true };
    return this.categoryModel.find(filter).lean().exec() as unknown as Promise<
      CategoryDocument[]
    >;
  }

  async findById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).lean().exec();
    if (!category) throw new NotFoundException(`Category "${id}" not found`);
    return category as unknown as CategoryDocument;
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ slug }).lean().exec();
    if (!category) throw new NotFoundException(`Category "${slug}" not found`);
    return category as unknown as CategoryDocument;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryDocument> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.categoryModel.findOne({ slug });
    if (existing) {
      throw new ConflictException(
        `Category with slug "${slug}" already exists`,
      );
    }
    const created = new this.categoryModel({ ...dto, slug });
    return created.save();
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDocument> {
    await this.findById(id);
    const updateData: any = { ...dto };
    if (dto.name) {
      updateData.slug = this.generateSlug(dto.name);
    }
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .lean()
      .exec();
    return updated as unknown as CategoryDocument;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findById(id);
    await this.categoryModel.findByIdAndDelete(id);
    return { message: "Category deleted successfully" };
  }

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }
}
