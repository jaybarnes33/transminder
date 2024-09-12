import axiosInstance from "@/lib/axios";
import { User } from "@/types/auth";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/auth");
        setUser(data.user);
      } catch (error) {
        setError(error);
      }
    };
    fetchUser();
  }, []);

  return { user, setUser, loading, error };
};
