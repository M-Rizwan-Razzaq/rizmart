export const STORAGE_KEYS = {
  authToken: "desi_muse_token",
  cart: "desi_muse_cart",
  wishlist: "desi_muse_wishlist",
} as const;

export const LEGACY_STORAGE_KEYS = {
  authToken: "luxora_token",
  cart: "luxora_cart",
  wishlist: "luxora_wishlist",
} as const;

export function getStoredValue(key: string, legacyKey?: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key) ?? (legacyKey ? localStorage.getItem(legacyKey) : null);
}
