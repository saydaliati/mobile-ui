import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

<<<<<<< HEAD
<<<<<<< HEAD
const API_URL = "http://172.16.11.240:3000";
=======
const API_URL = "http://192.168.1.161:3000";
>>>>>>> aee9687 (Authentication System Completed Successfully)
=======
const API_URL = "http://172.16.8.26:3000";
>>>>>>> 37ea5ca (Authentication System Completed)

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

export interface RegisterCredentials extends LoginCredentials {
  // name: string;
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

  async register(credentials: RegisterCredentials): Promise<String> {
    if(!credentials.email || !credentials.password ){
      throw new Error("All fields are required");
    }
    if(credentials.password.length < 6){
      throw new Error("Password must be at least 6 characters");
    }

    try {
      const response = await api.post<String>("/auth/register", credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "An error occurred during registration"
        );
      }
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<String> {
    try {
      const response = await api.post<String>("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "An error occurred during forgot password"
        );
      }
      throw error;
    }
  }

  async checkAuth(): Promise<AuthResponse | null> {
    const auth = await AsyncStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  }
}

export const authService = new AuthService();