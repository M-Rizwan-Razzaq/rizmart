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
  appName: "Desi Muse",
  contactEmail: "desimuse.pk@gmail.com",
  contactPhone: "+1 (212) 555-0143",
  atelier: "18 Via Montenapoleone, Milan, Italy",
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
    label: "Atelier",
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
    label: "Home Category Image - Rings",
    description: "Shown in the Rings category card on the homepage.",
  },
  {
    key: "homeCategoryImageNecklaces",
    label: "Home Category Image - Necklaces",
    description: "Shown in the Necklaces category card on the homepage.",
  },
  {
    key: "homeCategoryImageBraceletes",
    label: "Home Category Image - Braceletes",
    description: "Shown in the Braceletes category card on the homepage.",
  },
  {
    key: "homeCategoryImageEarrings",
    label: "Home Category Image - Earrings",
    description: "Shown in the Earrings category card on the homepage.",
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
