import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView className="flex-1 px-4 bg-white">
      <Header />
      {children}
    </SafeAreaView>
  );
};

export default Wrapper;
