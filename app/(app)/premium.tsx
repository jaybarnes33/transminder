import Back from "@/components/Core/Back";
import { Actions } from "@/components/Core/Header";
import { pricingData } from "@/constants";

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import { Image } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PremiumScreen() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  return (
    <SafeAreaView className="relative h-screen">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />

      <View className="flex-row items-center justify-between px-4 py-3">
        <Back />
        <Text className="text-2xl font-fwbold">Go Premium!</Text>
        <Actions activity={false} chat={true} profile={false} />
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="flex-row justify-between ">
          <Image source={require("@/assets/images/premium-line.png")} />
          <View className=" w-5/6">
            <View className="flex-row">
              <View className="flex-1">
                <Text className="text-lg font-semibold mb-1">
                  Upgrade to Premium
                </Text>
                <Text className="text-sm font-main text-gray-600">
                  Enjoy unlimited tracking, detailed reports, gallery access,
                  full map, cloud backup, and more...
                </Text>
              </View>
            </View>

            <View className="mt-12 mb-6">
              <Text className="text-lg font-semibold mb-1">
                Your Support Matters
              </Text>
              <Text className="text-sm font-main text-gray-600">
                By going Premium, you help us keep the app secure, private, and
                growing. If it's not the right time for you, our free features
                are always here for you.
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-y-3 mb-6">
          {pricingData.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center p-4 bg-white rounded-xl`}
              onPress={() => handleSelect(item.id)}
            >
              <View
                className={`w-5 h-5 border-2 rounded-full mr-3 ${
                  selectedId === item.id
                    ? "border-purple-500 bg-purple-600"
                    : " border-gray-400"
                }`}
              />
              <View className="flex-1">
                <Text className="text-base font-semibold">{item.price}</Text>
                <Text className="text-sm font-main text-gray-600">
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="items-center mb-4">
          <Text className="text-sm text-gray-600">Restore purchases</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-purple-600  mt-7 rounded-full py-4 items-center">
          <Text className="text-white text-base font-semibold">Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
});
