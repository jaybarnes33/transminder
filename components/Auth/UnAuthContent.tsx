import { View, Text } from "react-native";
import React, { ReactNode, useEffect } from "react";
import { useUser } from "@/context/Auth";
import { useRouter } from "expo-router";

const UnAuthContent = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const { navigate } = useRouter();
  useEffect(() => {
    if (user) {
      navigate("/(app)/(tabs)");
    }
  }, [user]);
  return <>{children}</>;
};

export default UnAuthContent;
