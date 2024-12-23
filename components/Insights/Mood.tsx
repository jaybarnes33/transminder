import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyInsight from "./Empty";
import { getAverageMood, getDaysOfWeek } from "@/utils";
import MonthlyMoodChart from "./MonthlyMoodChart";
import WeeklyMoodChart from "./WeeklyMoodChart";
import YearlyMoodChart from "./YearlyMoodChart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const moodMapping: Record<string, number> = {
  terrible: 1,
  bad: 2,
  okay: 3,
  good: 4,
  awesome: 5,
};

const chartHeight = 120;
const daysOfWeek = getDaysOfWeek();

export interface MoodLog {
  dayOfWeek: string;
  mood: string;
  feelings: string[];
  date: Date;
}

interface MoodAnalytics {
  moodLogs: MoodLog[];
  averageMoodScore: number;
}

const MoodInsight = ({
  start,
  end,
  range,
}: {
  start: Date;
  end: Date;
  range: "month" | "week" | "year" | "all" | string;
}) => {
  const colors = {
    terrible: "bg-[#f87171]",
    awesome: "bg-[#46C17E]",
    bad: "bg-[#FD8C6C]",
    okay: "bg-[#F7CD1B]",
    good: "bg-[#AFEBC4]",
  };

  const fetchMoodData = async () => {
    const { data } = await axiosInstance.get(
      `/insights/mood?start=${start}&end=${end}`
    );
    return data;
  };

  const { data, isLoading, error, mutate } = useSWR<MoodAnalytics>(
    ["/mood-insights", start, end],
    fetchMoodData
  );

  useEffect(() => {
    mutate();
  }, [start, end, range]);

  if (error) {
    return (
      <View className="bg-white mb-4 rounded-[20px] p-4 gap-y-4">
        <Text className="font-semibold text-base text-red-400">
          Failed to load mood insights.
        </Text>
      </View>
    );
  }

  if (isLoading || !data?.moodLogs.length) {
    return (
      <EmptyInsight
        label="Log your moods"
        heading="Well-being"
        showEmojis
        description={
          isLoading
            ? "Loading your mood insights..."
            : "No moods logged for this period"
        }
      />
    );
  }

  const month = start.getMonth();
  const year = start.getFullYear();

  return (
    <View className="bg-white m-1 shadow mb-4 rounded-[20px] p-4 gap-y-1">
      <Text className="font-semibold text-base">Well-being</Text>
      <View className="flex-row relative justify-between items-center mb-2">
        <Text className="font-semibold text-base">
          {getAverageMood(data?.averageMoodScore!)[1]}
        </Text>
        <Text className="text-red-400 font-semibold text-sm">
          {getAverageMood(data?.averageMoodScore!)[0]}
          &nbsp;
          <MaterialCommunityIcons
            name="information"
            size={14}
            className="mr-2"
          />
        </Text>
        <Image
          source={require("@/assets/images/line.png")}
          className="w-full absolute -bottom-2"
        />
      </View>
      <View className="h-16" />
      {data?.moodLogs && (
        <>
          {range === "week" && (
            <WeeklyMoodChart
              moodLogs={data.moodLogs}
              daysOfWeek={daysOfWeek}
              colors={colors}
              moodMapping={moodMapping}
              chartHeight={chartHeight}
            />
          )}
          {range === "month" && (
            <MonthlyMoodChart
              moodLogs={data.moodLogs}
              month={month}
              year={year}
            />
          )}
          {(range === "year" || range === "all") && (
            <YearlyMoodChart moodLogs={data.moodLogs} />
          )}
        </>
      )}
    </View>
  );
};

export default MoodInsight;
