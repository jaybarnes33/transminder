import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { resources } from "@/utils/createMockData";
import { Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
import Icon from "../Core/Icon";
import { IconName, Resource } from "@/types/global";
import { useRouter } from "expo-router";

export const colors = {
  video: "text-orange-500",
  guide: "text-rose-400",
  article: "text-blue-500",
};
const Bookmarks = () => {
  const width = Dimensions.get("window").width;

  const { navigate } = useRouter();
  const handlePress = (resource: Resource) => {
    navigate({
      pathname: "/(app)/resource",
      params: { resource: JSON.stringify(resource) },
    });
  };
  return (
    <View className="">
      <Text className="font-fwbold text-xl">
        Your bookmarks <Text className="text-neutral-400">4</Text>
      </Text>
      <ScrollView
        className="h-[130px] my-2 space-x-4"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {resources.slice(0, 4).map((resource) => (
          <TouchableOpacity
            onPress={() => handlePress(resource)}
            key={resource.title}
            className="flex-row bg-white items-center rounded-[20px] shadow space-x-3 p-4 h-full"
            style={{ width: width - 35 }}
          >
            <View className="w-1/4 h-full rounded-xl bg-neutral-200"></View>
            <View className="flex-1 space-y-1">
              <View className="flex-row items-center space-x-1">
                <Icon name={resource.type as IconName} />
                <Text
                  className={clsx([
                    "font-semibold capitalize text-xs",
                    colors[resource.type as keyof typeof colors],
                  ])}
                >
                  {resource.type}
                </Text>
              </View>
              <Text className="text-base font-semibold wrap">
                {resource.title}
              </Text>
              <View className="flex-row space-x-1 items-center">
                {resource.type === "guide" && (
                  <Text className="text-sm text-neutral-400 font-semibold">
                    {resource.steps?.length} Steps
                  </Text>
                )}
                <View className="h-1 w-1 rounded-full bg-neutral-400" />
                <Text className="text-sm text-neutral-400 font-semibold">
                  3 min
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Bookmarks;
