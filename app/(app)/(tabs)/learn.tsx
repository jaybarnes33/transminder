import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Actions } from "@/components/Core/Header";
import Bookmarks from "@/components/Resources/Bookmarks";
import Search from "@/components/Explore/maps/Search";
import Featured from "@/components/Resources/Featured";
import Section from "@/components/Resources/Section";

const Learn = () => {
  return (
    <SafeAreaView className="px-4 bg-neutral-100">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-fwbold">For you</Text>
        <Actions />
      </View>

      <Search search={console.log} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <Bookmarks />
        <Featured />
        <Section title="Healthcare & Wellness" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Learn;
