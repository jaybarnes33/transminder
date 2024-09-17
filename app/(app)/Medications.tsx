import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { drugs } from "@/constants";

const Medications = () => {
  return (
    <SafeAreaView className="px-4 bg-gray-100 flex-1">
      <Text className=" text-3xl font-Bold font-bold">
        All Medications <Text className="text-neutral-400">{drugs.length}</Text>
      </Text>

      <FlatList
        data={drugs}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mt-4 rounded-3xl">
            <Text className="font-main font-semibold text-lg">{item.name}</Text>
            <Text className="font-main text-neutral-500"></Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Medications;
