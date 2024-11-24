import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyInsight from "./Empty";
import Emoji from "../Core/Emoji";
import { getAverageMood, getDaysOfWeek } from "@/utils";
import { getDaysInMonth } from "date-fns"; // Importing the function from date-fns
import MonthlyMoodChart from "./MonthlyMoodChart"; // Import the new MonthlyMoodChart component
import WeeklyMoodChart from "./WeeklyMoodChart"; // Import the new WeeklyMoodChart component
import { MaterialCommunityIcons } from "@expo/vector-icons";
import YearlyMoodChart from "./YearlyMoodChart";

// Define mood score mapping
const moodMapping: Record<string, number> = {
  terrible: 1,
  bad: 2,
  okay: 3,
  good: 4,
  awesome: 5,
};

const chartHeight = 120; // Height of the graph
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

  // Fetch mood data from the server
  const fetchMoodData = async () => {
    const { data } = await axiosInstance.get(
      `/insights/mood?start=${start}&end=${end}`
    );
    return data;
  };

  const { data, isLoading, error } = useSWR<MoodAnalytics>(
    "/mood-insights",
    fetchMoodData
  );

  if (error) {
    return (
      <View className="bg-white mb-4 rounded-[20px] p-4 gap-y-4">
        <Text className="font-semibold text-base text-red-400">
          Failed to load mood insights.
        </Text>
      </View>
    );
  }

  // Get the year and month from the start date
  const month = start.getMonth(); // Month is 0-indexed (0 = January)
  const year = start.getFullYear();

  return isLoading || !data?.moodLogs.length ? (
    <EmptyInsight
      label="Log your moods"
      heading="Well-being"
      showEmojis
      description="Loading your mood insights..."
    />
  ) : (
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
          {range === "month" && (
            <MonthlyMoodChart
              moodLogs={data.moodLogs}
              month={month}
              year={year}
            />
          )}

          {range === "week" && (
            <WeeklyMoodChart
              moodLogs={data.moodLogs}
              daysOfWeek={daysOfWeek}
              colors={colors}
              moodMapping={moodMapping}
              chartHeight={chartHeight}
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
