import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/auth";
import { getTokens, logout } from "@/utils/auth";
import useSWR from "swr";
import { useRouter } from "expo-router";
import { Text } from "react-native";

type AuthContextType = {
  user: User | undefined;
  logOut: () => void;
  loading: boolean;
  error: any;
  mutate: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const fetchUser = async () => {
    const { data } = await axiosInstance.get("/auth");
    return data;
  };

  const { navigate } = useRouter();
  const { data, error, isLoading, mutate } = useSWR("/auth", fetchUser);
  const logOut = async () => {
    await logout();
    mutate(undefined, false);
    navigate("/Auth");
  };

  return (
    <AuthContext.Provider
      value={{ user: data, loading: isLoading, error, logOut, mutate }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
