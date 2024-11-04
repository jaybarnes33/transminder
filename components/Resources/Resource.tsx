import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { IconName, Resource as ResourceType } from "@/types/global";
import Icon from "../Core/Icon";
import clsx from "clsx";
import { useRouter } from "expo-router";

import { getResourceImage } from "@/utils";
import { Image } from "expo-image";

const Resource = ({
  resource,
  heading,
}: {
  resource: ResourceType;
  heading?: boolean;
}) => {
  const width = Dimensions.get("window").width;
  const colors = {
    video: "text-orange-500",
    guide: "text-rose-400",
    article: "text-blue-500",
  };

  const { navigate } = useRouter();

  const handlePress = () => {
    navigate({
      pathname: "/(app)/resource",
      params: { resource: resource._id },
    });
  };
  return (
    <TouchableOpacity
      disabled={heading}
      onPress={handlePress}
      className={clsx([
        "bg-white shadow p-4  space-y-2 rounded-[20px]  mr-3 ",
        heading && "space-y-5 p-0 bg-transparent ",
        !heading && "h-[250px]",
      ])}
      style={{ width: width - 35 }}
    >
      <Image
        source={{ uri: getResourceImage(resource.thumbnail) }}
        className={clsx(["h-4/6 bg-neutral-300", heading && "h-[250px]"])}
        contentFit={"contain"}
      />
      <View className={clsx([heading && " space-y-2"])}>
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
        <Text
          className={clsx([
            "text-base font-semibold wrap",
            heading && "text-2xl font-fwbold",
          ])}
        >
          {resource.title}
        </Text>
        <View className="flex-row space-x-1 items-center">
          {resource.type === "guide" && (
            <>
              <Text className="text-sm text-neutral-400 font-semibold">
                {resource.steps?.length} Steps
              </Text>
              <View className="h-1 w-1 rounded-full bg-neutral-400" />
            </>
          )}
          <Text className="text-sm text-neutral-400 font-semibold"> 3 min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Resource;
