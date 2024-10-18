import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate as globalMutate } from "swr"; // globalMutate to clear cache
import Message from "@/components/Core/Message";
import { Item } from "@/components/Health/Plan";
import { ActivityItem, PaginatedResponse } from "@/types/global";
import Moodlog from "@/components/ActivityLogs/Moodlog";

const Activity = () => {
  const [page, setPage] = useState(1); // Always start with page 1
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [hasMore, setHasMore] = useState(true); // Indicates if there's more data to load

  // Function to fetch activities for the given page
  const fetchActivities = async (page: number) => {
    const { data } = await axiosInstance.get<PaginatedResponse>(
      `/activities?page=${page}`
    );
    return data;
  };

  const { data, isLoading, error, mutate } = useSWR<PaginatedResponse>(
    `/activities?page=${page}`, // SWR key
    () => fetchActivities(page),
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

  //Clear cache for activities when leaving the component (unmounting)
  useEffect(() => {
    return () => {
      globalMutate(`/activities?page=${page}`, undefined, {
        revalidate: false,
      });
    };
  }, [page]);

  // Reset page to 1 when the component mounts (i.e., when the user returns to this page)
  useEffect(() => {
    setPage(1); // Ensure it fetches from page 1 upon mounting
    setActivityData([]); // Clear previous data when resetting to page 1
  }, []);

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

  return (
    <SafeAreaView className="px-4 bg-neutral-100 flex-1">
      <View className="flex flex-row">
        <Back />
        <Text className="font-semibold text-xl mx-auto">Activity Log</Text>
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
              {/* Add other item renderings here (mood, event, drug) */}
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
