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
      '<p class="mb-4">Founded in a quiet Milanese atelier, Desi Muse was built on a single belief: fine jewelry should be worn, not stored.</p><p class="mb-4">Every piece begins as a sketch on paper. It is then hand-modeled in wax, cast in recycled precious metals, and finished by a single master jeweler - from stone-setting to final polish. We refuse mass production. We refuse shortcuts.</p><p>Our stones are ethically sourced through partnerships built over decades. Our gold is 100% recycled. Our warranty is for life, because a piece worth making is a piece worth keeping.</p>',
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    contentHtml:
      '<p class="mb-4">Desi Muse respects your privacy. We collect only the information required to fulfill your orders and improve your experience. We never sell your data.</p><h2 class="mt-6 mb-3 text-2xl font-display text-foreground">Information We Collect</h2><p class="mb-4">Contact details, shipping addresses, and order history. Payment information is processed by our secure providers and never stored on our servers.</p><h2 class="mt-6 mb-3 text-2xl font-display text-foreground">Cookies</h2><p class="mb-4">We use essential cookies for cart persistence and analytics cookies to understand site usage.</p><h2 class="mt-6 mb-3 text-2xl font-display text-foreground">Your Rights</h2><p>You may request access, correction or deletion of your data at any time by contacting our support team.</p>',
  },
  "terms-of-service": {
    slug: "terms-of-service",
    title: "Terms & Conditions",
    contentHtml:
      '<p class="mb-4">By accessing Desi Muse, you agree to these terms. All content, imagery and designs are the property of Desi Muse.</p><p class="mb-4">Prices are subject to change without notice. Orders are subject to availability and confirmation.</p><p>Ownership of goods transfers upon delivery. Risk of loss passes upon our handover to the shipping carrier.</p>',
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    contentHtml:
      '<p class="mb-4">Unworn pieces may be returned within 30 days of delivery for a full refund. Items must be in original condition with all packaging.</p><p class="mb-4">Custom or engraved pieces are final sale.</p><p>Refunds are processed within 5 business days of receiving the returned item.</p>',
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
