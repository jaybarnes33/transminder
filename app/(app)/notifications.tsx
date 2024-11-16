import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import Icon from "@/components/Core/Icon";
import { FlashList } from "@shopify/flash-list";
import { formatRelative } from "date-fns";
import { capitalize } from "@/utils";

// Helper function to group notifications
const groupNotificationsByDate = (
  items: {
    _id: string;
    itemType: "event" | "drug";
    user: string;
    message: string;
    createdAt: Date;
  }[]
) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const groups = {
    today: [] as typeof items,
    yesterday: [] as typeof items,
    others: [] as typeof items,
  };

  items.forEach((item) => {
    const itemDate = startOfDay(new Date(item.createdAt));

    if (itemDate.getTime() === startOfDay(today).getTime()) {
      groups.today.push(item);
    } else if (itemDate.getTime() === startOfDay(yesterday).getTime()) {
      groups.yesterday.push(item);
    } else {
      groups.others.push(item);
    }
  });

  return groups;
};

const Notifications = () => {
  const { data, isLoading } = useSWR("/notifications", async () => {
    const { data: res } = await axiosInstance.get("/notifications");
    return res;
  });

  const comments = {
    drug: "Stay on top of your health routine!",
    event: "Don't miss your scheduled event!",
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const groupedNotifications = groupNotificationsByDate(data);

  const renderNotifications = (title: string, items: any[]) => (
    <View className="space-y-1">
      <Text className="font-semibold">{title}</Text>
      <FlashList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="bg-white flex-row items-center space-x-2 rounded-xl my-2 p-2">
            <View className="bg-blue-200 w-12 h-12 items-center justify-center rounded-full border border-blue-500">
              <Icon name={item.itemType} />
            </View>
            <View className="flex-1  space-y-1">
              {title === "Other Days" && (
                <Text className="font-semibold text-neutral-500">
                  {capitalize(
                    formatRelative(new Date(item.createdAt), new Date())
                  )}
                </Text>
              )}
              <Text className="font-fwbold text-base">{item.message}</Text>
              <Text className="font-main text-sm text-neutral-500">
                {comments[item.itemType as keyof typeof comments]}
              </Text>
            </View>
          </View>
        )}
        estimatedItemSize={100}
      />
    </View>
  );

  return (
    <SafeAreaView className="px-4 space-y-4 flex-1 bg-neutral-200">
      <View className="mt-4 flex-row justify-between">
        <Back />
        <Text className="font-main text-lg text-center flex-1">
          Notifications
        </Text>
      </View>

      {data?.length > 0 ? (
        <FlashList
          data={[
            { title: "Today", items: groupedNotifications.today },
            { title: "Yesterday", items: groupedNotifications.yesterday },
            { title: "Other Days", items: groupedNotifications.others },
          ]}
          renderItem={({ item }) => renderNotifications(item.title, item.items)}
          keyExtractor={(item) => item.title}
          estimatedItemSize={200}
        />
      ) : (
        <Text>No notifications found</Text>
      )}
    </SafeAreaView>
  );
};

export default Notifications;
