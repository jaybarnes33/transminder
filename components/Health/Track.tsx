import { View, Text } from "react-native";
import React from "react";
import Heading from "../Core/Heading";
import { Octicons } from "@expo/vector-icons";

const Track = () => {
  return (
    <View className="mt-7">
      <Heading text="Keep Track" description="Last 7 days" />
      <View className="mt-4 bg-white h-[108] rounded-[20px] p-4 shadow-sm space-y-1">
        <View className="flex-row  justify-between items-center">
          <Text className="font-main text-base">Medication plan</Text>
          <Text className="font-main font-semibold text-base">Last 7 days</Text>
        </View>
        <Text className="font-main text-xl font-bold">7/7 intake</Text>
        <View className="flex-row  space-x-2 items-center">
          <Octicons name="check-circle-fill" size={12} color="green" />
          <Text>Complete intake</Text>
        </View>
      </View>
      <View className="mt-2 bg-white h-[108] rounded-[20px] p-4 shadow-sm space-y-1">
        <View className="flex-row  justify-between items-center">
          <Text className="font-main text-base">Well-being</Text>
          <Text className="font-main font-semibold text-base">Last 7 days</Text>
        </View>
        <Text className="font-main text-xl font-bold">Mostly anxious</Text>
        <View className="flex-row  space-x-2 items-center">
          <Octicons name="check-circle-fill" size={12} color="green" />
          <Text>Complete intake</Text>
        </View>
      </View>
    </View>
  );
};

export default Track;
