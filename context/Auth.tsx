import React, { createContext, useContext, useEffect, useState } from "react";
import { getTokens, getUser } from "@/utils/auth"; // Import your getTokens function
import { User } from "@/types/auth";
import { useRouter } from "expo-router";
import { setUser as saveUser } from "@/utils/auth";
type AuthContextType = {
  user: User | undefined;
  loading: boolean;
  error: any;
  setUser: (user: User | undefined) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokens = await getTokens();
        const activeUser = await getUser();
        console.log({ activeUser });
        if (tokens.accessToken) {
          setUser(activeUser);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    if (user?._id) {
      saveUser(user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(AuthContext);

  console.log({ context });
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};
