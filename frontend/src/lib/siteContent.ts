export type SiteContentSlug = "about" | "privacy-policy" | "terms-of-service" | "refund-policy";

export type SiteContentDraft = {
  slug: SiteContentSlug;
  title: string;
  contentHtml: string;
};

export const SITE_CONTENT_TABS: Array<{
  slug: SiteContentSlug;
  label: string;
}> = [
  { slug: "about", label: "About" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-of-service", label: "Terms of Service" },
  { slug: "refund-policy", label: "Refund Policy" },
];

export const DEFAULT_SITE_CONTENT: Record<SiteContentSlug, SiteContentDraft> = {
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

export function createSiteContentForm(
  slug: SiteContentSlug,
  overrides?: Partial<SiteContentDraft> | null,
): SiteContentDraft {
  const base = DEFAULT_SITE_CONTENT[slug];

  return {
    slug,
    title: overrides?.title?.trim() || base.title,
    contentHtml: overrides?.contentHtml?.trim() || base.contentHtml,
  };
}

export function normalizeSiteContentHtml(html: string): string {
  return html.trim();
}
