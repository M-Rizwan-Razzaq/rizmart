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
      '<p class="mb-4">RizMart is an online store offering bags for school, work, travel and everyday use. The collection includes backpacks, school bags, laptop bags and travel bags.</p><p class="mb-4">Product details, materials and specifications vary by item. Check each product page for the information currently available, price and stock status.</p><p>For questions about an item or an existing order, please contact the RizMart support team.</p>',
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
