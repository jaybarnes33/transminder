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

export const colors = {
  video: "text-orange-500",
  guide: "text-rose-400",
  article: "text-blue-500",
};
const Section = ({ title }: { title: string }) => {
  return (
    <View className="mt-7">
      <Text className="font-fwbold text-xl">{title}</Text>
      <ScrollView
        className=" my-2 space-x-4"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {resources.slice(4, 6).map((resource) => (
          <Resource key={resource.title} resource={resource} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Section;
