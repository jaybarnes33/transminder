import { Tokens, User } from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export const getTokens = async (): Promise<Tokens> => {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync("accessToken"),
    SecureStore.getItemAsync("refreshToken"),
  ]);
  return { accessToken, refreshToken };
};

export const setTokens = async (tokens: Tokens) => {
  await Promise.all([
    SecureStore.setItemAsync("accessToken", tokens.accessToken!),
    SecureStore.setItemAsync("refreshToken", tokens.refreshToken!),
  ]);
};

export const setUser = async (user: User) => {
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
