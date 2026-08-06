import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "../products/schemas/product.schema";
import { Category, CategorySchema } from "../categories/schemas/category.schema";
import { SitemapController } from "./sitemap.controller";
import { SitemapService } from "./sitemap.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
