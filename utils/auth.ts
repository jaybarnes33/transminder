import { Tokens, User } from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

export const getTokens = (): Tokens => {
  const [accessToken, refreshToken] = [
    SecureStore.getItem("accessToken"),
    SecureStore.getItem("refreshToken"),
  ];
  return { accessToken, refreshToken };
};

export const setTokens = async (tokens: Tokens) => {
  await Promise.all([
    SecureStore.setItemAsync("accessToken", tokens.accessToken!),
    SecureStore.setItemAsync("refreshToken", tokens.refreshToken!),
  ]);
};

export const saveUser = async (user: User) => {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
};

export const getUser = async (): Promise<User> => {
  const user = await SecureStore.getItemAsync("user");
  return JSON.parse(user!);
};

export const logout = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync("accessToken"),
    SecureStore.deleteItemAsync("refreshToken"),
    SecureStore.deleteItemAsync("user"),
  ]);
};

export const checkTokenExpiration = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp! < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If there's an error decoding the token, consider it expired
  }
};

export const setOnboardingCompleted = async () => {
  await SecureStore.setItemAsync("onboardingCompleted", "true");
};

export const onboardingCompleted = async (): Promise<boolean> => {
  const onboardingCompleted = await SecureStore.getItemAsync(
    "onboardingCompleted"
  );
  return onboardingCompleted === "true";
};

export const getAvatar = (avatar: string, id: string) => {
  return avatar.startsWith("http")
    ? avatar
    : process.env.EXPO_PUBLIC_ENV !== "production"
    ? `${
        Platform.OS !== "android"
          ? process.env.EXPO_PUBLIC_BASE
          : process.env.EXPO_PUBLIC_ANDROID_BASE
      }/uploads/${id}/${avatar}`
    : `${process.env.EXPO_PUBLIC_URL}/uploads/${id}/${avatar}`;
};
