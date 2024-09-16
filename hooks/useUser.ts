import axiosInstance from "@/lib/axios";
import { User } from "@/types/auth";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchUser = async () => {
    setLoading(true);
    const { data } = await axiosInstance.get("/auth");
    setUser(data);
    return data;
  };

  const { data, error: swrError } = useSWR("/auth", fetchUser);
  return { user: data, loading, error };
};
