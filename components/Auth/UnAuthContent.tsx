import { View, Text } from "react-native";
import React, { ReactNode, useEffect } from "react";
import { useUser } from "@/context/Auth";
import { useRouter } from "expo-router";
import SkeletonLoader from "../Core/Skeleton";

const UnAuthContent = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useUser();
  const { navigate } = useRouter();
  useEffect(() => {
    if (!loading && user) {
      navigate("/(app)/(tabs)");
    }
  }, [user]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return <>{children}</>;
};

export default UnAuthContent;
