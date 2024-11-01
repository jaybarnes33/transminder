import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Icon from "../Core/Icon";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";

const HealthReport = ({ start, end }: { start: Date; end: Date }) => {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);

  const hasAccess = true;

  const requestReport = async () => {
    if (!hasAccess) {
      return navigate("/(app)/report");
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/insights/report?start=${start}&end=${end}`
      );
      alert(data.message);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="mt-10 space-y-2">
      <Text className="font-fwbold text-xl">Health report</Text>
      <TouchableOpacity
        onPress={requestReport}
        className=" bg-white space-x-2  items-start rounded-[20px] justify-between p-4 flex-row"
      >
        <View className="mt-1">
          <Icon name="health-report" />
        </View>
        <View className="flex-1">
          <Text className="font-fwbold text-base">Health Report</Text>
          <Text className="font-semibold text-neutral-400 text-sm max-w-[300px] ">
            Review your inputs to spot trends, understand patterns, and improve
            your decisions—perfect for sharing with your care team or for
            personal insights.
          </Text>
        </View>
        {!loading ? (
          <Feather name="chevron-right" size={20} />
        ) : (
          <ActivityIndicator />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HealthReport;
