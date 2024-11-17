import React, { useEffect, useRef } from "react";

import { Tabs } from "expo-router";
import * as Notifications from "expo-notifications";
import TabBar from "@/components/Layout/TabBar";
import { useUser } from "@/hooks/useUser";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import axiosInstance from "@/lib/axios";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const { user } = useUser();

  const responseListener = useRef<Notifications.EventSubscription>();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldSetBadge: false,
      shouldPlaySound: false,
    }),
  });

  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && !user?.notificationTokens.includes(token)) {
        await axiosInstance.put(`/users/${user?._id}`, {
          notificationToken: token,
        });
      }
    })();

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("--- notification tapped ---");
        console.log(response);
        console.log("------");
      });

    // Unsubscribe from events
    return () => {
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="insights" />
      <Tabs.Screen name="gallery" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="learn" />
    </Tabs>
  );
}
