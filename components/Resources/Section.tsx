import { View, Text, Dimensions } from "react-native";
import React from "react";

import {
  PaginatedResponse,
  Resource as IResource,
  Collection,
} from "@/types/global";
import Resource from "./Resource";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import { FlashList } from "@shopify/flash-list";
import Message from "../Core/Message";
import { ResourceLoader } from "./Loaders/Resource";

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
    return <ResourceLoader />;
  }

  if (!data?.pagination.total) {
    return;
  }

  const width = Dimensions.get("window").width;
  const fullWidth = data.data.length < 2;
  return (
    <View className="mt-7 flex-1  w-full">
      <Text className="font-fwbold text-xl">{collection.name}</Text>
      <FlashList
        data={data?.data}
        className=" my-2 gap-x-4 w-screen"
        horizontal
        estimatedItemSize={200}
        renderItem={({ item }) => (
          <View style={fullWidth && { width: width - 16 }} key={item._id}>
            <Resource fullWidth={data.data.length < 2} resource={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Section;
