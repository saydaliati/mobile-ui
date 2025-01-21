import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ User: User; token: string }>) => {
      const { User, token } = action.payload;
      state.isAuthenticated = true;
      state.user = User;
      state.token = token;
      state.loading = false;
      state.error = null;
      // Persist to AsyncStorage
      AsyncStorage.setItem("auth", JSON.stringify({ User, token }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      // Clear AsyncStorage
      AsyncStorage.removeItem("auth");
    },
    hydrate: (state, action: PayloadAction<{ User: User; token: string }>) => {
      const { User, token } = action.payload;
      state.isAuthenticated = true;
      state.user = User;
      state.token = token;
    },
  },
});

export const { setLoading, setError, loginSuccess, logout, hydrate } =
  authSlice.actions;
export default authSlice.reducer;