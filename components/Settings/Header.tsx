import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Back from "../Core/Back";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

const Header = () => {
  const route = useRoute();

  const getTitle = (routeName: string) => {
    let title = routeName;
    if (title === "index") {
      title = "Settings";
    } else {
      const split = title.replace(/\(|\)/g, "").split("/");
      title = title.includes("index") ? split[0] : split[split.length - 1];
    }
    return title;
  };
  return (
    <View className="flex-row  items-center mb-4 ">
      <Back />
      <Text className=" mx-auto -ml-5 flex-1 text-center font-main text-lg capitalize font-semibold">
        {getTitle(route.name)}
      </Text>
    </View>
  );
};

export default Header;
