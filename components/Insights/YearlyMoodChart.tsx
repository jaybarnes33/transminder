import React from "react";
import { View, Text, Image } from "react-native";
import EmptyInsight from "./Empty";
import clsx from "clsx";
import { PieChart } from "react-native-svg-charts";
import { MoodLog } from "./Mood";
import Emoji from "../Core/Emoji";

interface YearlyMoodChartProps {
  moodLogs: MoodLog[];
}

// Define colors object
export const colors = {
  terrible: { text: "text-[#f87171]", bg: "#f87171" },
  awesome: { text: "text-[#46C17E]", bg: "#46C17E" },
  bad: { text: "text-[#FD8C6C]", bg: "#FD8C6C" },
  okay: { text: "text-[#F7CD1B]", bg: "#F7CD1B" },
  good: { text: "text-[#AFEBC4]", bg: "#AFEBC4" },
};

const YearlyMoodChart: React.FC<YearlyMoodChartProps> = ({ moodLogs }) => {
  // Process mood logs to calculate mood counts
  const moodCounts: Record<string, number> = {};

  moodLogs.forEach((log) => {
    if (!moodCounts[log.mood]) {
      moodCounts[log.mood] = 0;
    }
    moodCounts[log.mood] += 1; // Count occurrences for each mood
  });

  const donutData = Object.entries(moodCounts).map(([mood, count], index) => ({
    key: index,
    value: count,
    svg: {
      fill: colors[mood as keyof typeof colors]?.bg || "#000", // Fallback color
      cornerRadius: 10,
    },
  }));

  // Donut chart render function
  const renderDonutChart = () => (
    <PieChart
      style={{ height: 150, width: 150 }}
      data={donutData}
      innerRadius={65}
      outerRadius={75}
      padAngle={0.02}
    />
  );

  return moodLogs.length === 0 ? (
    <EmptyInsight
      label="Mental health"
      heading="Log your emotion"
      showEmojis
      description="No emotions logged yet. Start tracking to see insights and view your monthly moods here."
    />
  ) : (
    <View className="space-y-3 -mt-10">
      <View className="flex-row items-center">
        {/* Donut chart */}
        <View className="mx-5 ">{renderDonutChart()}</View>
        <View className="flex-1">
          {Object.entries(moodCounts).map(([mood, count], index) => (
            <View
              key={mood}
              className="flex-row space-x-2 items-center justify-between flex-1"
            >
              <Emoji name={`${mood}-active`} />
              <Text className="font-semibold flex-1 text-dark capitalize">
                {mood}
              </Text>
              <Text
                className={clsx([
                  "font-fwbold text-dark capitalize",
                  colors[mood as keyof typeof colors]?.text || "text-black", // Fallback text color
                ])}
              >
                {count}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Image source={require("@/assets/images/line.png")} className="w-full" />
      <Text className="font-semibold text-neutral-400 text-xs">
        Your moods tracked throughout the year.
      </Text>
    </View>
  );
};

export default YearlyMoodChart;
