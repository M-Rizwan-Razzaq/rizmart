export type BrandSettings = {
  appName: string;
  contactEmail: string;
  contactPhone: string;
  atelier: string;
  homeMainImage: string;
  homeCategoryImageRings: string;
  homeCategoryImageNecklaces: string;
  homeCategoryImageBraceletes: string;
  homeCategoryImageEarrings: string;
  aboutUsImage: string;
};

export const DEFAULT_BRAND_FORM: BrandSettings = {
  appName: "RizMart",
  contactEmail: "rizmart.pk@gmail.com",
  contactPhone: "+92 318 6592403",
  atelier: "Karachi, Pakistan",
  homeMainImage: "",
  homeCategoryImageRings: "",
  homeCategoryImageNecklaces: "",
  homeCategoryImageBraceletes: "",
  homeCategoryImageEarrings: "",
  aboutUsImage: "",
};

export const THEME_BRAND_FIELDS: Array<{
  key: keyof BrandSettings;
  label: string;
  description: string;
}> = [
  {
    key: "appName",
    label: "App Name",
    description: "Shown in the header, footer, and admin console.",
  },
  {
    key: "contactEmail",
    label: "Contact Email",
    description: "Displayed in the contact card and privacy policy.",
  },
  {
    key: "contactPhone",
    label: "Contact Phone",
    description: "Displayed in the contact card and footer.",
  },
  {
    key: "atelier",
    label: "Studio Address",
    description: "Displayed on the contact page and about page.",
  },
];

export const THEME_BRAND_IMAGE_FIELDS: Array<{
  key: keyof BrandSettings;
  label: string;
  description: string;
}> = [
  {
    key: "homeMainImage",
    label: "Home Main Image",
    description: "Shown in the homepage hero section.",
  },
  {
    key: "homeCategoryImageRings",
    label: "Home Category Image - Laptop Bags",
    description: "Shown in the Laptop Bags category card on the homepage.",
  },
  {
    key: "homeCategoryImageNecklaces",
    label: "Home Category Image - Backpacks",
    description: "Shown in the Backpacks category card on the homepage.",
  },
  {
    key: "homeCategoryImageBraceletes",
    label: "Home Category Image - Travel Bags",
    description: "Shown in the Travel Bags category card on the homepage.",
  },
  {
    key: "homeCategoryImageEarrings",
    label: "Home Category Image - Hand Bags",
    description: "Shown in the Hand Bags category card on the homepage.",
  },
  {
    key: "aboutUsImage",
    label: "About Us Image",
    description: "Shown in the about page hero section.",
  },
];

export function createBrandForm(overrides?: Partial<BrandSettings> | null): BrandSettings {
  return {
    ...DEFAULT_BRAND_FORM,
    appName: overrides?.appName?.trim() || DEFAULT_BRAND_FORM.appName,
    contactEmail: overrides?.contactEmail?.trim() || DEFAULT_BRAND_FORM.contactEmail,
    contactPhone: overrides?.contactPhone?.trim() || DEFAULT_BRAND_FORM.contactPhone,
    atelier: overrides?.atelier?.trim() || DEFAULT_BRAND_FORM.atelier,
    homeMainImage: overrides?.homeMainImage?.trim() || DEFAULT_BRAND_FORM.homeMainImage,
    homeCategoryImageRings:
      overrides?.homeCategoryImageRings?.trim() || DEFAULT_BRAND_FORM.homeCategoryImageRings,
    homeCategoryImageNecklaces:
      overrides?.homeCategoryImageNecklaces?.trim() ||
      DEFAULT_BRAND_FORM.homeCategoryImageNecklaces,
    homeCategoryImageBraceletes:
      overrides?.homeCategoryImageBraceletes?.trim() ||
      DEFAULT_BRAND_FORM.homeCategoryImageBraceletes,
    homeCategoryImageEarrings:
      overrides?.homeCategoryImageEarrings?.trim() || DEFAULT_BRAND_FORM.homeCategoryImageEarrings,
    aboutUsImage: overrides?.aboutUsImage?.trim() || DEFAULT_BRAND_FORM.aboutUsImage,
  };
}
