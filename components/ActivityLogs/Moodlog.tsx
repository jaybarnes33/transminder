import { View, Text } from "react-native";
import React from "react";
import { Image } from "react-native";
import Icon from "../Core/Icon";
import { ActivityItem } from "@/types/global";
import Emoji from "../Core/Emoji";
import { format } from "date-fns";
import Feeling, { colors } from "../Health/Feeling";
import clsx from "clsx";

const Moodlog = ({ mood }: { mood: ActivityItem["mood"] }) => {
  return (
    <View className="h-[116px] relative bg-white p-4 rounded-[20px] mb-2">
      <View className="space-y-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center space-x-1">
            <View
              className={clsx([
                "h-10 w-10 items-center justify-center rounded-full",
                colors[mood!.mood as keyof typeof colors],
              ])}
            >
              <Emoji name={mood!.mood} />
            </View>
            <Text className="font-semibold text-neutral-400 text-base">
              Feeling {mood?.mood}
            </Text>
          </View>
          <View className="items-end">
            <Text className="font-semibold text-neutral-400 text-sm">
              {format(new Date(mood!.createdAt), "d MMM yyyy")}
            </Text>
            <View className="flex-row space-x-1 items-center">
              <Icon name="sun" />
              <Text className="text-ring font-fwbold capitalize text-sm ">
                Daily tracker
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row space-x-3">
          {mood?.feelings.map((item: string) => (
            <View
              className="flex-row space-x-1 bg-[#EEFBF3] py-1 px-3 rounded-full items-center"
              key={item}
            >
              <Emoji name={item} size="sm" />
              <Text className="font-fwbold text-gray-400 text-xs capitalize">
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Moodlog;
