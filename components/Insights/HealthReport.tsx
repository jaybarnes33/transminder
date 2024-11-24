import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import Icon from "../Core/Icon";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import * as SecureStore from "expo-secure-store";

const REPORTS_LIMIT = 3;
const STORAGE_KEY = "health_reports_count";

const HealthReport = ({ start, end }: { start: Date; end: Date }) => {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const [reportsCount, setReportsCount] = useState(0);

  const hasAccess = true;

  useEffect(() => {
    loadReportsCount();
  }, []);

  const loadReportsCount = async () => {
    try {
      const storedData = await SecureStore.getItemAsync(STORAGE_KEY);
      if (storedData) {
        const { count, date } = JSON.parse(storedData);
        if (isToday(new Date(date))) {
          setReportsCount(count);
        } else {
          // Reset count if it's a new day
          setReportsCount(0);
          await SecureStore.setItemAsync(
            STORAGE_KEY,
            JSON.stringify({ count: 0, date: new Date().toISOString() })
          );
        }
      }
    } catch (error) {
      console.error("Error loading reports count:", error);
    }
  };

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const incrementReportsCount = async () => {
    const newCount = reportsCount + 1;
    setReportsCount(newCount);
    await SecureStore.setItemAsync(
      STORAGE_KEY,
      JSON.stringify({ count: newCount, date: new Date().toISOString() })
    );
  };

  const requestReport = async () => {
    if (!hasAccess) {
      return navigate("/(app)/report");
    }
    if (reportsCount >= REPORTS_LIMIT) {
      alert(
        "You've reached the limit of 3 reports per day. Please try again tomorrow."
      );
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/insights/report?start=${start}&end=${end}`
      );
      await incrementReportsCount();
      alert(data.message);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-10 gap-y-2">
      <Text className="font-fwbold text-xl">Health report</Text>
      <TouchableOpacity
        onPress={requestReport}
        className="bg-white gap-x-2 items-start rounded-[20px] justify-between p-4 flex-row"
      >
        <View className="mt-1">
          <Icon name="health-report" />
        </View>
        <View className="flex-1">
          <Text className="font-fwbold text-base">Health Report</Text>
          <Text className="font-semibold text-neutral-400 text-sm max-w-[300px]">
            Review your inputs to spot trends, understand patterns, and improve
            your decisions—perfect for sharing with your care team or for
            personal insights.
          </Text>
          <Text className="font-semibold text-neutral-400 text-sm mt-2">
            Reports remaining today: {REPORTS_LIMIT - reportsCount}
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
