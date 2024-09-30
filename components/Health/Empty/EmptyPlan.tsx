import { View, Text, Image } from "react-native";
import React from "react";

const EmptyPlan = () => {
  return (
    <View className="flex-row space-x-2 items-center bg-white p-4 shadow rounded-[20px]">
      <Image source={require("@/assets/images/plan-blank.png")} />
      <View className="w-[60%]">
        <Text className="font-semibold text-sm text-gray-400">
          No medications added yet
        </Text>
        <Text className="font-main text-sm">
          Stay on top of your health by adding your medications and reminders.
          We'll help you keep everything in check.
        </Text>
      </View>
    </View>
  );
};

export default EmptyPlan;
