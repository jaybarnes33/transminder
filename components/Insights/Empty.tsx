import { View, Text } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDaysOfWeek, getLastNDaysWithDayInitials } from "@/utils";
import Emoji from "@/components/Core/Emoji";
import { Image } from "react-native";
import clsx from "clsx";
import { RawButton } from "react-native-gesture-handler";

interface EmptyProps {
  heading: string;
  label?: string;
  description: string;
  showEmojis?: boolean;
}
const EmptyInsight = ({
  heading,
  label,
  description,
  showEmojis,
}: EmptyProps) => {
  return (
    <View className="min-h-[248] bg-white mb-4 rounded-[20px] p-4 space-y-4">
      <Text className="font-semibold text-base">{heading}</Text>
      <View className="flex-row  items-center justify-end">
        {!!label && <Text className="font-fwbold text-lg flex-1">{label}</Text>}
        <Text className="font-fwbold  text-orange-400">
          <MaterialCommunityIcons
            name="information"
            size={14}
            className="mr-2"
          />
          &nbsp; No data
        </Text>
      </View>
      <View className="flex-row justify-between relative py-2">
        {heading !== "Mental health" ? (
          getLastNDaysWithDayInitials(7).map((item) => (
            <View key={item.date} className="items-center space-y-1">
              <View className="mb-1">
                {showEmojis && <Emoji name="emoji" />}
              </View>
              <Emoji name="circle" />
              <Text className="font-semibold text-neutral-400">
                {item.dayOfWeek}
              </Text>
            </View>
          ))
        ) : (
          <Image source={require("@/assets/images/mental-health.png")} />
        )}
        <Image
          source={require("@/assets/images/line.png")}
          className={clsx([
            "w-full  absolute -bottom-[6px]",
            showEmojis && "top-[-4]",
          ])}
        />
      </View>
      <View>
        <Text className="font-semibold text-neutral-600">{description}</Text>
      </View>
    </View>
  );
};

export default EmptyInsight;
