/**
 * Wishlist slice — stores product IDs client-side, persisted to localStorage.
 * Syncs with backend when user is authenticated (handled in WishlistPage).
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "@/lib/storageKeys";

interface WishlistState {
  ids: string[];
}

const STORAGE_KEY = STORAGE_KEYS.wishlist;

function load(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEYS.wishlist);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  localStorage.removeItem(LEGACY_STORAGE_KEYS.wishlist);
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { ids: load() } as WishlistState,
  reducers: {
    toggleWishlist(state, { payload: id }: PayloadAction<string>) {
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
      save(state.ids);
    },
    removeFromWishlist(state, { payload: id }: PayloadAction<string>) {
      state.ids = state.ids.filter((x) => x !== id);
      save(state.ids);
    },
    clearWishlist(state) {
      state.ids = [];
      save([]);
    },
    setWishlistIds(state, { payload }: PayloadAction<string[]>) {
      state.ids = payload;
      save(payload);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist, setWishlistIds } =
  wishlistSlice.actions;

export const selectWishlistIds = (s: { wishlist: WishlistState }) => s.wishlist.ids;
export const selectWishlistCount = (s: { wishlist: WishlistState }) => s.wishlist.ids.length;
export const selectIsWishlisted = (id: string) => (s: { wishlist: WishlistState }) =>
  s.wishlist.ids.includes(id);

export default wishlistSlice.reducer;
