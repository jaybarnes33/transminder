import { View, Text, ScrollView } from "react-native";
import React from "react";
import { resources } from "@/utils/createMockData";

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
