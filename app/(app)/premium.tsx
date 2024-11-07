import Back from "@/components/Core/Back";
import { Actions } from "@/components/Core/Header";

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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

        <View className="space-y-3 mb-6">
          <TouchableOpacity className="flex-row items-center p-4 bg-gray-100 rounded-xl">
            <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3" />
            <View className="flex-1">
              <Text className="text-base font-semibold">$00.00 Monthly</Text>
              <Text className="text-sm font-main text-gray-600">
                Starting today
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 bg-purple-100 rounded-xl">
            <View className="w-5 h-5 rounded-full bg-purple-600 mr-3" />
            <View className="flex-1">
              <Text className="text-base font-semibold">
                $00.00 Yearly ($0/month)
              </Text>
              <Text className="text-sm font-main text-gray-600">
                First 7 days free
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 bg-gray-100 rounded-xl">
            <View className="w-5 h-5 rounded-full border-2 border-gray-400 mr-3" />
            <View className="flex-1">
              <Text className="text-base font-semibold">
                $00.00 for 6 Months ($0/month)
              </Text>
              <Text className="text-sm font-main text-gray-600">
                First 7 days free
              </Text>
            </View>
          </TouchableOpacity>
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
