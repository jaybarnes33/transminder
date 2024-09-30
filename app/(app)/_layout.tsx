import { useUser } from "@/context/Auth";
import axiosInstance from "@/lib/axios";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { user } = useUser();
  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && !user?.notificationTokens.includes(token)) {
        await axiosInstance.put(`/users/${user?._id}`, {
          notificationToken: token,
        });
      }
    })();
  }, []);

  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
  );
}
