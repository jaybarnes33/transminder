import React from "react";

import { Tabs } from "expo-router";

import TabBar from "@/components/Layout/TabBar";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
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
