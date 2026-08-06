/**
 * Cart slice — fully client-side, persisted to localStorage.
 * Products are stored by id+slug+name+price so we don't need to re-fetch.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "@/lib/storageKeys";

export interface CartProduct {
  _id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  material: string;
  category: string;
  stock: number;
  sku: string;
}

export interface CartItem {
  product: CartProduct;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = STORAGE_KEYS.cart;

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEYS.cart);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.removeItem(LEGACY_STORAGE_KEYS.cart);
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() } as CartState,
  reducers: {
    addToCart(state, { payload }: PayloadAction<{ product: CartProduct; qty?: number }>) {
      const { product, qty = 1 } = payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ product, qty });
      }
      saveCart(state.items);
    },

    removeFromCart(state, { payload: id }: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product._id !== id);
      saveCart(state.items);
    },

    setQty(state, { payload }: PayloadAction<{ id: string; qty: number }>) {
      const item = state.items.find((i) => i.product._id === payload.id);
      if (item) item.qty = Math.max(1, payload.qty);
      saveCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCart([]);
    },
  },
});

export const { addToCart, removeFromCart, setQty, clearCart } = cartSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartItems = (s: { cart: CartState }) => s.cart.items;
export const selectCartCount = (s: { cart: CartState }) =>
  s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartSubtotal = (s: { cart: CartState }) =>
  s.cart.items.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.qty, 0);

export default cartSlice.reducer;
