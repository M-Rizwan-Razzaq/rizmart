import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS, getStoredValue } from "@/lib/storageKeys";

export type Role = "admin" | "customer";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ── Async thunks ─────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (creds: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<{ token: string; user: AuthUser }>("/auth/login", creds);
      localStorage.setItem(STORAGE_KEYS.authToken, data.token);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.authToken);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<{ token: string; user: AuthUser }>("/auth/register", body);
      localStorage.setItem(STORAGE_KEYS.authToken, data.token);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.authToken);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMeThunk = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (body: Partial<{ name: string; phone: string }>, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const { data } = await api.patch<AuthUser>(`/users/${auth.user!._id}`, body);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  token: getStoredValue(STORAGE_KEYS.authToken, LEGACY_STORAGE_KEYS.authToken),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.authToken);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });

    // Fetch me (rehydrate on page load)
    builder
      .addCase(fetchMeThunk.fulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(LEGACY_STORAGE_KEYS.authToken);
      });

    // Update profile
    builder.addCase(updateProfileThunk.fulfilled, (state, { payload }) => {
      if (state.user) state.user = { ...state.user, ...payload };
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
