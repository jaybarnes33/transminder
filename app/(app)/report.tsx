import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { getLastNDaysWithDayInitials } from "@/utils";
import { format } from "date-fns";
import { Image } from "react-native";
import { useRouter } from "expo-router";

const Report = () => {
  const week = getLastNDaysWithDayInitials(7);
  const { navigate } = useRouter();
  return (
    <SafeAreaView className="p-4 space-y-10 bg-gray-100 flex-1">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigate("/(app)/(tabs)/insights")}>
          <Feather name="x" size={17} color="gray" />
        </TouchableOpacity>
        <View className="flex-row items-center space-x-5">
          <Text className="font-semibold    text-neutral-500 text-center text-base">
            Health report preview
          </Text>
          <Text className="text-[10px] font-semibold text-neutral-500">{`${format(
            week[0].date,
            "MMMM d"
          )} - ${format(week[6].date, "MMMM d")}`}</Text>
        </View>
      </View>
      <Text className="text-center font-semibold text-sm max-w-sm  mx-auto">
        Here’s what your report could look like: Log meds, moods, emotions,
        notes, and health check-ins. Easily share it with your care team. Note:
        This is not a diagnostic tool.
      </Text>

      <View className="bg-white rounded-[20px] shadow items-center justify-center  p-5 mx-auto">
        <Image source={require("@/assets/images/report.png")} />
      </View>
      <TouchableOpacity className="bg-ring items-center absolute w-full mx-4 bottom-10 justify-center h-[50] rounded-full">
        <Text className="font-fwbold text-white text-base">
          Unlock health report
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Report;
