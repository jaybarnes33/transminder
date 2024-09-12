import { View, Text } from "react-native";

import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import { useRoute } from "@react-navigation/native";

const _layout = () => {
  const route = useRoute();
  return (
    <SafeAreaView className="flex-1 px-4 bg-gray-100">
      <View className="flex-row  items-center mb-4 ">
        <Back />
        <Text className=" mx-auto -ml-5 flex-1 text-center font-main text-lg capitalize font-semibold">
          {route.name.replace(/[()]/g, "")}
        </Text>
      </View>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </SafeAreaView>
  );
};

export default _layout;
