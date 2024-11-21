import { useUser } from "@/context/Auth";
import axiosInstance from "@/lib/axios";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";

export default function AppLayout() {
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
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
  );
}
