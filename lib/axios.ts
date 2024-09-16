import { checkTokenExpiration, getTokens, setTokens } from "@/utils/auth";
import { Platform } from "react-native";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Create an Axios instance with default configurations
const baseURL =
  process.env.EXPO_PUBLIC_ENV !== "production"
    ? `${
        Platform.OS !== "android"
          ? process.env.EXPO_PUBLIC_BASE
          : process.env.EXPO_PUBLIC_ANDROID_BASE
      }/api`
    : `${process.env.EXPO_PUBLIC_URL}/api`;
const axiosInstance: AxiosInstance = axios.create({
  baseURL, // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add headers or modify requests
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add authorization token or other headers here
    const { accessToken: token, refreshToken } = await getTokens();

    if (token && refreshToken) {
      if (!checkTokenExpiration(token as string)) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        const { data } = await axios.get(`${baseURL}/auth/refresh`, {
          headers: {
            Authorization: `Refresh ${refreshToken}`,
          },
        });
        await setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;
      }
      return config;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
