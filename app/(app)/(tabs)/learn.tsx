import { View, Text, TouchableOpacity } from "react-native";
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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { navigate } = useRouter();

  const fetchCollections = async () => {
    const { data } = await axiosInstance.get("/resources/collections");
    return data;
  };

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

  const handleSearch = (s: string, collection?: string) => {
    setSearch(s);
    navigate({
      pathname: "/(app)/learnsearch",
      params: { search: s, collection },
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const filteredData = selectedCategory
    ? data?.filter((item) => item._id === selectedCategory)
    : data;

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

      {data?.length && (
        <FlashList
          ListEmptyComponent={<Message message="No resources found" />}
          data={[{ name: "bookmarks", _id: "bookmark" }, ...data]}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mr-4 rounded-xl p-2 border ${
                selectedCategory === item._id
                  ? "bg-purple-500 border-purple-500"
                  : "border-gray-600"
              }`}
              onPress={() => handleCategorySelect(item._id)}
            >
              <Text
                className={`font-fwbold capitalize ${
                  selectedCategory === item._id ? "text-white" : "text-gray-600"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          className="mb-2"
          showsHorizontalScrollIndicator={false}
        />
      )}

      {data && (
        <FlashList
          ListEmptyComponent={<Message message="No resources found" />}
          estimatedItemSize={5}
          data={[
            ...(selectedCategory === "bookmark" || !selectedCategory
              ? [{ name: "bookmarks", _id: "bookmark" }]
              : []),
            ...(filteredData || []),
          ]}
          renderItem={({ item }) =>
            item.name === "bookmarks" ? (
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
