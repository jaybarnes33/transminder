import { View, Text } from "react-native";

import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="add" />
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
    </Stack>
  );
};

export default _layout;
