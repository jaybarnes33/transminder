import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Icon from "./Icon";
import { useUser } from "@/context/Auth";
import { useRouter } from "expo-router";

export const Actions = () => {
  const { navigate } = useRouter();
  return (
    <View className="flex-row items-center space-x-2">
      <TouchableOpacity
        onPress={() => navigate("/(app)/activitylogs")}
        className="h-8 w-8 bg-white rounded-full items-center justify-center"
      >
        <Image source={require("@/assets/images/stars.png")} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigate("/(settings)")}
        className="h-8 w-8 bg-white rounded-full items-center justify-center"
      >
        <Icon name="user" />
      </TouchableOpacity>
    </View>
  );
};
const Header = () => {
  const { user } = useUser();

  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="font-main text-base font-semibold">
        Hello, {user?.name?.split(" ")[0] ?? user?.name}!
      </Text>
      <Actions />
    </View>
  );
};

export default Header;
