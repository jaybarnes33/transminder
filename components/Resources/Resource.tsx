import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import React from "react";
import { IconName, Resource as ResourceType } from "@/types/global";
import Icon from "../Core/Icon";
import clsx from "clsx";
import { useRouter } from "expo-router";

import { getReadingTime, getImage } from "@/utils";

const Resource = ({
  resource,
  heading,
  fullWidth,
}: {
  resource: ResourceType;
  heading?: boolean;
  fullWidth?: boolean;
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
        heading && " p-0 bg-transparent w-full ",
        !heading && " bg-white h-[270px]  shadow y-2 p-4  rounded-[20px]    ",
      ])}
      style={
        !heading && {
          width: !fullWidth ? width / 1.3 : width - 35,
          margin: 4,
        }
      }
    >
      <Image
        source={{ uri: getImage(resource.thumbnail) }}
        className={clsx([
          "rounded-[20px] bg-neutral-300",
          heading ? "h-[250px]" : "h-48",
        ])}
      />
      <View className=" my-2">
        <View className="flex-row items-center gap-x-1">
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
        <View className="flex-row gap-x-1 items-center">
          {resource.type === "guide" && (
            <>
              <Text className="text-sm text-neutral-400 font-semibold">
                {resource.steps?.length} Steps
              </Text>
              <View className="h-1 w-1 rounded-full bg-neutral-400" />
            </>
          )}
          {(resource.type === "article" || resource.type === "guide") && (
            <Text className="text-sm text-neutral-400 font-semibold">
              {getReadingTime(
                resource.type === "article"
                  ? resource.content!
                  : resource.steps?.join(" ")!
              )}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Resource;
