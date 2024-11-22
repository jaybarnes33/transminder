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
import { ResourceLoader } from "@/components/Resources/Loaders/Resource";
import EmptyState from "@/components/Health/Empty";
import { useRouter } from "expo-router";

const Learn = () => {
  const fetchCollections = async () => {
    const { data } = await axiosInstance.get("/resources/collections");
    return data;
  };

  const { navigate } = useRouter();
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
    return <ResourceLoader />;
  }

  const handleSearch = (s: string) => {
    setSearch(s);
    navigate({
      pathname: "/(app)/learnsearch",
      params: { search: s },
    });
  };
  return (
    <SafeAreaView className="px-4 flex-1 bg-neutral-100">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-fwbold">For you</Text>
        <Actions activity={false} />
      </View>

      {data?.length! > 0 ? (
        <Search search={handleSearch} term={search} />
      ) : (
        <EmptyState
          description="No resources available now, please check later"
          heading="No resources available"
        />
      )}

      {data && (
        <FlashList
          ListEmptyComponent={<Message message="No resources found" />}
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
