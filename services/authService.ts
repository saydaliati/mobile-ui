import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://172.16.8.26:3000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth").then((data) =>
      data ? JSON.parse(data).token : null
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  User: {
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "An error occurred during login"
        );
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem("auth");
  }

  async checkAuth(): Promise<AuthResponse | null> {
    const auth = await AsyncStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  }
}

export const authService = new AuthService();