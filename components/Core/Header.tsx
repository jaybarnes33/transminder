import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Icon from "./Icon";
import { useUser } from "@/context/Auth";
import { useRouter } from "expo-router";

const Header = () => {
  const { user } = useUser();

  const { navigate } = useRouter();
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="font-main text-base font-semibold">
        Hello, {user?.name?.split(" ")[0] ?? user?.name}!
      </Text>
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity className="h-8 w-8 bg-white rounded-full items-center justify-center">
          <Image source={require("@/assets/images/stars.png")} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("/(settings)")}
          className="h-8 w-8 bg-white rounded-full items-center justify-center"
        >
          <Icon name="user" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
