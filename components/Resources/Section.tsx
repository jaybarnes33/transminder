import { View, Text } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { resources } from "@/utils/createMockData";
import { Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
import Icon from "../Core/Icon";
import {
  IconName,
  PaginatedResponse,
  Resource as IResource,
  Collection,
} from "@/types/global";
import Resource from "./Resource";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import { FlashList } from "@shopify/flash-list";
import Message from "../Core/Message";

export const colors = {
  video: "text-orange-500",
  guide: "text-rose-400",
  article: "text-blue-500",
};
const Section = ({
  collection,
  search = "",
}: {
  search: string;
  collection: Collection;
}) => {
  const fetchResources = async () => {
    const { data } = await axiosInstance.get(
      `/resources?search=${search}&order="desc"&collections=${collection._id}`
    );
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<IResource[]>
  >(
    `/resources?search=${search}&order="desc"&collections=${collection._id}`,
    fetchResources
  );

  if (error) {
    return (
      <Message isError message={error.message ?? "Failed to fetch posts"} />
    );
  }
  if (isLoading) {
    return <Text>Loading</Text>;
  }

  if (!data?.pagination.total) {
    return;
  }
  return (
    <View className="mt-7 flex-1">
      <Text className="font-fwbold text-xl">{collection.name}</Text>
      <FlashList
        data={data?.data}
        className=" my-2 space-x-4"
        horizontal
        estimatedItemSize={100}
        renderItem={({ item }) => <Resource key={item._id} resource={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Section;
