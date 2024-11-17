import { View, Text } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { resources } from "@/utils/createMockData";
import { Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
import Icon from "../Core/Icon";
import { IconName } from "@/types/global";
import Resource from "./Resource";

const Featured = () => {
  return (
    <View className="mt-7">
      <Text className="font-fwbold text-xl">Featured</Text>
      <ScrollView
        className=" my-2 gap-x-4"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {resources.slice(4, 6).map((resource) => (
          <Resource resource={resource} key={resource.title} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Featured;
