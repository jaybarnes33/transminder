import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";

import clsx from "clsx";
import Icon from "../Core/Icon";
import { IconName, Resource } from "@/types/global";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate } from "swr";
import Message from "../Core/Message";
import { FlashList } from "@shopify/flash-list";

import { getImage, getReadingTime } from "@/utils";
import { BookmarkLoader } from "./Loaders/Bookmark";

export const colors = {
  video: "text-orange-500",
  guide: "text-rose-400",
  article: "text-blue-500",
};
const Bookmarks = ({ search }: { search: string }) => {
  const width = Dimensions.get("window").width;

  const { navigate } = useRouter();
  const handlePress = (resource: Resource) => {
    navigate({
      pathname: "/(app)/resource",
      params: { resource: resource._id },
    });
  };

  const fetchResources = async () => {
    const { data } = await axiosInstance.get(
      `/resources/bookmarks?search=${search}`
    );
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR<Resource[]>(
    `/resources/bookmarks`,
    fetchResources
  );

  useEffect(() => {
    (async () => {
      await mutate();
    })();
  }, [search]);

  if (isLoading) {
    return <BookmarkLoader />;
  }

  if (error) {
    return <Message isError message={"Failed to load bookmarks"} />;
  }

  if (!data?.length) {
    return;
  }
  return (
    <View>
      <Text className="font-fwbold text-xl">
        Your bookmarks <Text className="text-neutral-400">{data?.length}</Text>
      </Text>
      <FlashList
        data={data}
        estimatedItemSize={5}
        renderItem={({ item: resource }) => (
          <TouchableOpacity
            onPress={() => handlePress(resource)}
            key={resource.title}
            style={{ width: width - 35 }}
            className="flex-row m-1 bg-white items-center mr-5 rounded-[20px] shadow gap-x-3 p-4 h-[120px]"
          >
            <Image
              className="w-1/4 h-full rounded-xl"
              source={{ uri: getImage(resource.thumbnail) }}
            />
            <View className="flex-1 gap-y-1">
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
              <Text className="text-base font-semibold wrap">
                {resource.title}
              </Text>
              <View className="flex-row gap-x-1 items-center">
                {resource.type === "guide" && (
                  <View>
                    <Text className="text-sm text-neutral-400 font-semibold">
                      {resource.steps?.length} Steps
                    </Text>

                    <View className="h-1 w-1 rounded-full bg-neutral-400" />
                  </View>
                )}
                <Text className="text-sm text-neutral-400 font-semibold">
                  {getReadingTime(
                    resource.type === "article"
                      ? resource.content!
                      : resource.steps?.join(" ")!,
                    200,
                    true
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        className="h-[130px] my-2 gap-x-4"
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Bookmarks;
