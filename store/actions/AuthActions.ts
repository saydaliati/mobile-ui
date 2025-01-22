import { AppDispatch } from "../store";
import { authService, LoginCredentials } from "@/services/authService";
import { setLoading, setError, loginSuccess, logout } from "../slices/authSlice";

export const loginUser = (credentials: LoginCredentials) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response));
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch: AppDispatch) => {
    await authService.logout();
    dispatch(logout());
  };
};