import { registerForPushNotificationsAsync } from "@/utils/notification";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  useEffect(() => {
    (async () => registerForPushNotificationsAsync())();
  }, []);

  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
  );
}
