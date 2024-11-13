import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Actions } from "@/components/Core/Header";

import Search from "@/components/Explore/maps/Search";

import Section from "@/components/Resources/Section";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import { Collection } from "@/types/global";
import { FlashList } from "@shopify/flash-list";
import Message from "@/components/Core/Message";
import Bookmarks from "@/components/Resources/Bookmarks";

const Learn = () => {
  const fetchCollections = async () => {
    const { data } = await axiosInstance.get("/resources/collections");
    return data;
  };

  const [search, setSearch] = useState("");

  const { data, error, isLoading } = useSWR<Collection[]>(
    "/resources/collections",
    fetchCollections,
    {
      revalidateOnMount: true,
      refreshWhenHidden: true,
      refreshInterval: 10000 * 60,
    }
  );

  if (error) {
    return (
      <Message isError message={error.message ?? "Failed to fetch posts"} />
    );
  }
  if (isLoading && !data) {
    return <Text>Loading</Text>;
  }

  return (
    <SafeAreaView className="px-4 flex-1 bg-neutral-100">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-fwbold">For you</Text>
        <Actions activity={false} />
      </View>

      <Search search={setSearch} term={search} />

      {data && (
        <FlashList
          estimatedItemSize={5}
          data={[{ name: "bookmark", _id: "bookmark" }, ...data]}
          renderItem={({ item }) =>
            item.name === "bookmark" ? (
              <Bookmarks search={search} />
            ) : (
              <Section
                collection={item as Collection}
                search={search}
                key={(item as Collection)._id}
              />
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Learn;
