import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

import { productsApi } from "./services/productsApi";
import { categoriesApi } from "./services/categoriesApi";
import { ordersApi } from "./services/ordersApi";
import { usersApi } from "./services/usersApi";
import { dashboardApi } from "./services/dashboardApi";
import { addressesApi } from "./services/addressesApi";
import { themeApi } from "./services/themeApi";
import { contactApi } from "./services/contactApi";
import { brandApi } from "./services/brandApi";
import { siteContentApi } from "./services/siteContentApi";
import { authApi } from "./services/authApi";
import { newsletterApi } from "./services/newsletterApi";
import { marketingApi } from "./services/marketingApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,

    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [addressesApi.reducerPath]: addressesApi.reducer,
    [themeApi.reducerPath]: themeApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [siteContentApi.reducerPath]: siteContentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [newsletterApi.reducerPath]: newsletterApi.reducer,
    [marketingApi.reducerPath]: marketingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      categoriesApi.middleware,
      ordersApi.middleware,
      usersApi.middleware,
      dashboardApi.middleware,
      addressesApi.middleware,
      themeApi.middleware,
      contactApi.middleware,
      brandApi.middleware,
      siteContentApi.middleware,
      authApi.middleware,
      newsletterApi.middleware,
      marketingApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
