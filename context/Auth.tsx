import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/auth";
import { logout } from "@/utils/auth";
import useSWR from "swr";
import { useRouter } from "expo-router";

type AuthContextType = {
  user: User | undefined;
  logOut: () => void;
  loading: boolean;
  error: any;
  loggingOut: boolean;
  hasMapsAccess: boolean;
  mutate: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [mapsAccess, setMapsAccess] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const fetchUser = async () => {
    const { data } = await axiosInstance.get("/auth");
    setMapsAccess(data.hasMapsAccess);
    return data;
  };

  const { navigate } = useRouter();
  const { data, error, isLoading, mutate } = useSWR<User>("/auth", fetchUser);

  const logOut = async () => {
    try {
      setLoggingOut(true);
      await logout();
      mutate(undefined, false);
      navigate("/Auth");
    } catch (error) {
      //@ts-ignore
      alert(error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: data,
        loading: isLoading,
        error,
        hasMapsAccess: mapsAccess,
        logOut,
        mutate,
        loggingOut,
      }}
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
