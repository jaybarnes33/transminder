import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate as globalMutate } from "swr"; // globalMutate to clear cache
import Message from "@/components/Core/Message";
import { Item } from "@/components/Health/Plan";
import { ActivityItem, PaginatedResponse } from "@/types/global";
import Moodlog from "@/components/ActivityLogs/Moodlog";
import ActivityTypePicker from "@/components/ActivityLogs/ActivityPicker";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import clsx from "clsx";

const Activity = () => {
  const [page, setPage] = useState(1); // Always start with page 1
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [hasMore, setHasMore] = useState(true); // Indicates if there's more data to load
  const [filter, setFilter] = useState({
    type: "",
    sort: "desc",
  }); // For filtering by activity type

  // Function to fetch activities for the given page
  const fetchActivities = async (
    page: number,
    filter: { sort: string; type: string }
  ) => {
    const { data } = await axiosInstance.get<PaginatedResponse<ActivityItem[]>>(
      `/activities?page=${page}&type=${filter.type}&sort=${filter.sort}`
    );
    return data;
  };

  const { data, isLoading, error, mutate } = useSWR<
    PaginatedResponse<ActivityItem[]>
  >(
    `/activities?page=${page}&type=${filter.type}&sort=${filter.sort}`, // SWR key
    () => fetchActivities(page, filter),
    {
      revalidateOnFocus: false, // Disable re-fetching on focus
      onSuccess: (fetchedData) => {
        if (fetchedData?.data) {
          setActivityData((prevData) =>
            page === 1 ? fetchedData.data : [...prevData, ...fetchedData.data]
          );

          // Check if we need to load more data
          if (
            fetchedData.pagination.currentPage >=
            fetchedData.pagination.totalPages
          ) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      },
    }
  );

  // Clear cache for activities when leaving the component (unmounting)
  useEffect(() => {
    return () => {
      globalMutate(
        `/activities?page=${page}&type=${filter.type}&sort=${filter.sort}`,
        undefined,
        {
          revalidate: false,
        }
      );
    };
  }, [page, filter]);

  // Reset page and clear data when the type changes
  useEffect(() => {
    setPage(1); // Reset to the first page
    setActivityData([]); // Clear previous activity data
    mutate(); // Trigger a re-fetch when the type changes
  }, [filter, mutate]);

  // Fetch more data when the user scrolls to the end
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1); // Load the next page only when the user explicitly scrolls
    }
  };

  const renderFooter = () => {
    if (!isLoading && !hasMore) return null;
    return <ActivityIndicator />;
  };

  const handleType = ({ value }: { label: string; value: string }) => {
    handleFilter("type", value);
  };

  const handleFilter = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value })); // Set the new type
  };

  return (
    <SafeAreaView className="px-4 bg-neutral-100 flex-1">
      <View className="flex flex-row">
        <Back />
        <Text className="font-semibold text-xl mx-auto">Activity Log</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <ActivityTypePicker handleChange={handleType} />
        <TouchableOpacity
          className={clsx([filter.sort === "asc" && " scale-x-[-1]"])}
          onPress={() =>
            handleFilter("sort", filter.sort === "desc" ? "asc" : "desc")
          }
        >
          <Ionicons name="swap-vertical-sharp" size={20} color={"gray"} />
        </TouchableOpacity>
      </View>
      <View className="mt-4 flex-1">
        {error && (
          <Message message={error?.message ?? "Failed to load"} isError />
        )}
        {/* Show loader for the first page */}
        <FlatList
          data={activityData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text className="font-semibold text-base">
              No activities logged
            </Text>
          }
          renderItem={({ item }) => (
            <View>
              {item.intake && (
                <Item
                  mutate={mutate}
                  item={{
                    ...item.intake,
                    status: item.action,
                    timestamp: item.timestamp,
                  }}
                />
              )}
              {item.mood && (
                <Moodlog
                  mood={{
                    ...item.mood,
                    mood: item.action,
                    createdAt: item.timestamp,
                  }}
                />
              )}
            </View>
          )}
          onEndReached={handleLoadMore} // Triggered when user scrolls to the end
          onEndReachedThreshold={0.5} // Load more when the list is halfway through
          ListFooterComponent={renderFooter} // Loading spinner at the bottom
        />
      </View>
    </SafeAreaView>
  );
};

export default Activity;
