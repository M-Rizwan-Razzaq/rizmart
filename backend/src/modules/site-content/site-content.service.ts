import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  SiteContent,
  SiteContentDocument,
} from "./schemas/site-content.schema";
import { UpdateSiteContentDto } from "./dto/update-site-content.dto";

type SiteContentSlug =
  "about" | "privacy-policy" | "terms-of-service" | "refund-policy";

const DEFAULT_SITE_CONTENT: Record<
  SiteContentSlug,
  { slug: SiteContentSlug; title: string; contentHtml: string }
> = {
  about: {
    slug: "about",
    title: "About Us",
    contentHtml:
      '<p class="mb-4">RizMart was built for people who move through the day with purpose. We design bags that work as hard as you do, from the first commute of the morning to the last trip home at night.</p><p class="mb-4">Every bag begins with a real carry need. We refine the structure, choose durable materials, test the zippers and straps, and shape the pockets so laptops, books, chargers and daily essentials all have a proper place.</p><p>Our focus is simple: thoughtful design, reliable construction and a bag you will actually reach for every day. We do not chase clutter or gimmicks. We build practical pieces that feel premium, look clean and last.</p>',
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    contentHtml:
      '<p class="mb-4">RizMart respects your privacy. We collect only the information required to fulfill your orders and improve your experience. We never sell your data.</p><h2 class="mt-6 mb-3 text-2xl font-display text-foreground">Information We Collect</h2><p class="mb-4">Contact details, shipping addresses, and order history. Payment information is processed by our secure providers and never stored on our servers.</p><h2 class="mt-6 mb-3 text-2xl font-display text-foreground">Cookies</h2><p class="mb-4">We use essential cookies for cart persistence and analytics cookies to understand site usage.</p><h2 class="mt-6 mb-3 text-2xl font-display text-foreground">Your Rights</h2><p>You may request access, correction or deletion of your data at any time by contacting our support team.</p>',
  },
  "terms-of-service": {
    slug: "terms-of-service",
    title: "Terms & Conditions",
    contentHtml:
      '<p class="mb-4">By accessing RizMart, you agree to these terms. All content, imagery and designs are the property of RizMart.</p><p class="mb-4">Prices are subject to change without notice. Orders are subject to availability and confirmation.</p><p>Ownership of goods transfers upon delivery. Risk of loss passes upon our handover to the shipping carrier.</p>',
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    contentHtml:
      '<p class="mb-4">Unused bags may be returned within 30 days of delivery for a full refund. Items must be in original condition with all packaging.</p><p class="mb-4">Custom, monogrammed or made-to-order bags are final sale.</p><p>Refunds are processed within 5 business days of receiving the returned item.</p>',
  },
};

@Injectable()
export class SiteContentService {
  constructor(
    @InjectModel(SiteContent.name)
    private readonly siteContentModel: Model<SiteContentDocument>,
  ) {}

  async getAll(): Promise<SiteContent[]> {
    await this.ensureDefaults();
    const docs = await this.siteContentModel
      .find()
      .sort({ slug: 1 })
      .lean()
      .exec();
    return docs as SiteContent[];
  }

  async getBySlug(slug: SiteContentSlug): Promise<SiteContent | null> {
    const defaults = DEFAULT_SITE_CONTENT[slug];
    if (!defaults) {
      throw new NotFoundException(`Content "${slug}" not found`);
    }

    const doc = await this.siteContentModel
      .findOneAndUpdate(
        { slug },
        { $setOnInsert: defaults },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean()
      .exec();

    return doc as SiteContent;
  }

  async updateBySlug(
    slug: SiteContentSlug,
    dto: UpdateSiteContentDto,
  ): Promise<SiteContent> {
    const defaults = DEFAULT_SITE_CONTENT[slug];
    if (!defaults) {
      throw new NotFoundException(`Content "${slug}" not found`);
    }

    const existing = await this.siteContentModel.findOne({ slug }).exec();
    const doc = existing ?? new this.siteContentModel(defaults);

    doc.slug = slug;
    doc.title = dto.title;
    doc.contentHtml = dto.contentHtml;

    const updated = await doc.save();

    if (!updated) {
      throw new NotFoundException(`Content "${slug}" could not be saved`);
    }

    return updated.toObject() as SiteContent;
  }

  private async ensureDefaults(): Promise<void> {
    await Promise.all(
      (
        Object.values(DEFAULT_SITE_CONTENT) as Array<
          (typeof DEFAULT_SITE_CONTENT)[SiteContentSlug]
        >
      ).map((content) =>
        this.siteContentModel
          .findOneAndUpdate(
            { slug: content.slug },
            { $setOnInsert: content },
            { new: true, upsert: true, setDefaultsOnInsert: true },
          )
          .exec(),
      ),
    );
  }
}
