import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

type RequestConfig = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: any;
};

type UseRequestResult<T> = {
  data: T | null;
  error: any;
  loading: boolean;
};

const useRequest = <T>(config: RequestConfig): UseRequestResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.request<T>({
          url: config.url,
          method: config.method || "GET",
          data: config.data,
          params: config.params,
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config.url, config.method, config.data, config.params]);

  return { data, error, loading };
};

export default useRequest;
