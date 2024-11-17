import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyInsight from "./Empty";
import clsx from "clsx";
import { PieChart } from "react-native-svg-charts"; // Import PieChart for donut chart
import { G, Text as SvgText, Circle } from "react-native-svg";
import Emoji from "../Core/Emoji";

interface MoodLog {
  dayOfWeek: string;
  mood: string;
  feelings: string[];
}

interface MoodAnalytics {
  moodLogs: MoodLog[];
  averageMoodScore: number;
  topFeelings: {
    name: string;
    percentage: number;
  }[];
}

const FeelingsInsight = ({ start, end }: { start: Date; end: Date }) => {
  const colors = [
    {
      text: "text-purple-500",
      bg: "#b85adf",
    },
    {
      text: "text-purple-600",
      bg: "#9333ea",
    },
    {
      text: "text-purple-700",
      bg: "#7e22ce",
    },
    {
      text: "text-purple-800",
      bg: "#6b21a8",
    },
    {
      text: "text-purple-900",
      bg: "#581c87",
    },
  ].reverse();

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
      <View className="bg-white mb-4 rounded-[20px] p-4 gap-y-4 ">
        <Text className="font-semibold text-base text-red-400">
          Failed to load mood insights.
        </Text>
      </View>
    );
  }

  const donutData =
    data?.topFeelings?.map((feeling, index) => ({
      key: index,
      value: feeling.percentage,
      svg: {
        fill: colors[index].bg,
        cornerRadius: 10, // Apply color from the colors array
      },
    })) || [];

  // Donut chart render function
  const renderDonutChart = () => (
    <PieChart
      style={{ height: 150, width: 150 }}
      data={donutData}
      innerRadius={65} // Set the inner radius for the donut effect
      outerRadius={75}
      padAngle={0.02}
    />
  );

  return isLoading || !data?.topFeelings.length ? (
    <EmptyInsight
      label="Mental health"
      heading="Log your emotion"
      showEmojis
      description="No emotions logged yet. Start tracking to see insights and view your top five emotions here"
    />
  ) : (
    <View className="bg-white shadow mb-4 rounded-[20px] p-4 gap-y-1">
      <Text className="font-semibold text-base">Mental health</Text>
      <View className="flex-row relative justify-between items-center mb-2"></View>

      <View className="gap-y-3">
        <View className="flex-row">
          {/* Donut chart */}
          <View className="w-[150px] h-[150px] mx-5">{renderDonutChart()}</View>
          <View className="flex-1">
            {data.topFeelings.map((feeling, index) => (
              <View
                key={feeling.name}
                className="flex-row justify-between flex-1"
              >
                <Text className="font-semibold text-dark capitalize">
                  {feeling.name}
                </Text>
                <Text
                  className={clsx([
                    "font-semibold text-dark capitalize",
                    colors[index].text,
                  ])}
                >
                  {feeling.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>
        <Image
          source={require("@/assets/images/line.png")}
          className="w-full"
        />
        <Text className="font-semibold text-neutral-400 text-xs">
          Your five main emotions collected from your daily log
        </Text>
      </View>
      {/* Graph displaying the mood over the week as bars */}
    </View>
  );
};

export default FeelingsInsight;
