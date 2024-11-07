import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { getDateRangeForLastNDays } from "@/utils";

const Heading = ({
  text,
  more,
  moreAction,
  description,
}: {
  text: string;
  more?: string;
  moreAction?: () => void;
  description?: string;
}) => {
  return (
    <View>
      <View className="flex-row items-center justify-between w-full space-x-2">
        <Text className="font-fwbold text-lg">{text}</Text>
        {more && (
          <TouchableOpacity onPress={moreAction}>
            <Text className="text-base text-neutral-500 font-semibold">
              {more}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {description && (
        <View className="flex-row space-x-1 items-center">
          <Text className="font-main font-semibold text-neutral-500">
            {description}
          </Text>
          <View className="h-1 w-1 bg-neutral-500 rounded-full" />
          <Text className="font-main font-semibold text-neutral-500">
            {getDateRangeForLastNDays(7)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Heading;
