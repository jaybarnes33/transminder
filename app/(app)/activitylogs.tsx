import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";

const Activity = () => {
  return (
    <SafeAreaView className="px-4 bg-neutral-100 flex-1">
      <View className="flex flex-row">
        <Back />
        <Text className="font-semibold text-xl mx-auto">Activity Log</Text>
      </View>
    </SafeAreaView>
  );
};

export default Activity;
