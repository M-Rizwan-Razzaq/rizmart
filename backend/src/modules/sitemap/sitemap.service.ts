import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { Product, ProductDocument } from "../products/schemas/product.schema";
import { Category, CategoryDocument } from "../categories/schemas/category.schema";

const STATIC_ROUTES: Array<{ path: string; priority: string; freq: string }> = [
  { path: "/", priority: "1.0", freq: "weekly" },
  { path: "/shop", priority: "0.9", freq: "weekly" },
  { path: "/about", priority: "0.6", freq: "monthly" },
  { path: "/contact", priority: "0.6", freq: "monthly" },
  { path: "/faq", priority: "0.5", freq: "monthly" },
  { path: "/terms", priority: "0.3", freq: "yearly" },
  { path: "/privacy", priority: "0.3", freq: "yearly" },
  { path: "/refund", priority: "0.3", freq: "yearly" },
];

@Injectable()
export class SitemapService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    private readonly configService: ConfigService,
  ) {}

  async buildXml(): Promise<string> {
    const baseUrl = this.configService
      .get<string>("siteUrl")
      ?.replace(/\/$/, "") as string;

    const [products, categories] = await Promise.all([
      this.productModel
        .find({ isActive: true })
        .select("slug updatedAt")
        .lean()
        .exec(),
      this.categoryModel
        .find({ isActive: true })
        .select("_id slug updatedAt")
        .lean()
        .exec(),
    ]);

    const urls = [...STATIC_ROUTES.map((r) => this.urlEntry(baseUrl + r.path, r.freq, r.priority))];

    for (const product of products) {
      urls.push(
        this.urlEntry(
          `${baseUrl}/product/${product.slug}`,
          "weekly",
          "0.8",
          (product as any).updatedAt,
        ),
      );
    }

    for (const category of categories) {
      urls.push(
        this.urlEntry(
          `${baseUrl}/shop?category=${(category as any)._id}`,
          "weekly",
          "0.7",
          (category as any).updatedAt,
        ),
      );
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
  }

  private urlEntry(loc: string, freq: string, priority: string, lastmod?: Date): string {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod.toISOString()}</lastmod>` : "";
    return `  <url>
    <loc>${this.escapeXml(loc)}</loc>${lastmodTag}
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  private escapeXml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }
}
