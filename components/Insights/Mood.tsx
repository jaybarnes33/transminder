import React from "react";
import { View, Text, Dimensions } from "react-native";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyInsight from "./Empty";
import Emoji from "../Core/Emoji";
import { getAverageMood, getLastNDaysWithDayInitials } from "@/utils";
import clsx from "clsx";
import { Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Define mood score mapping
const moodMapping: Record<string, number> = {
  terrible: 1,
  bad: 2,
  okay: 3,
  good: 4,
  awesome: 5,
};

// Screen width for responsive design
const screenWidth = Dimensions.get("window").width;
const chartHeight = 120; // Height of the graph
const daysOfWeek = getLastNDaysWithDayInitials(7);

interface MoodLog {
  dayOfWeek: string;
  mood: string;
  feelings: string[];
}

interface MoodAnalytics {
  moodLogs: MoodLog[];
  averageMoodScore: number;
}

const MoodInsight = () => {
  const colors = {
    terrible: "bg-[#f87171]",
    awesome: "bg-[#46C17E]",
    bad: "bg-[#FD8C6C]",
    okay: "bg-[#F7CD1B]",
    good: "bg-[#AFEBC4]",
  };
  // Fetch mood data from the server
  const fetchMoodData = async () => {
    const { data } = await axiosInstance.get("/insights/mood");
    return data;
  };

  const { data, isLoading, error } = useSWR<MoodAnalytics>(
    "/mood-insights",
    fetchMoodData
  );

  if (error) {
    return (
      <View className="bg-white mb-4 rounded-[20px] p-4 space-y-4">
        <Text className="font-semibold text-base text-red-400">
          Failed to load mood insights.
        </Text>
      </View>
    );
  }

  return isLoading ? (
    <EmptyInsight
      label="Log your moods"
      heading="Well-being"
      showEmojis
      description="Loading your mood insights..."
    />
  ) : (
    <View className="bg-white shadow mb-4 rounded-[20px] p-4 space-y-1">
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
      {/* Graph displaying the mood over the week as bars */}
      <View
        style={{
          height: chartHeight,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end", // Align bars to the bottom of the graph
        }}
      >
        {daysOfWeek.map((day, index) => {
          // Adjust the last day matching
          const log = data?.moodLogs.find((log) => {
            const logDayOfWeek = log.dayOfWeek;
            const mappedDayOfWeek = day.dayOfWeek.toLowerCase();

            // Compare days of week and explicitly handle last day, if necessary

            return logDayOfWeek === mappedDayOfWeek;
          });

          const moodScore = log ? moodMapping[log.mood] : 0; // Map mood to score (1-5)

          // Calculate the bar height based on mood score
          const barHeight = (moodScore / 5) * chartHeight;

          return (
            <View
              key={day.dayOfWeek}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <View>
                <Emoji name={moodScore ? `${log?.mood}-active` : "emoji"} />
              </View>

              {moodScore ? (
                <View
                  className={clsx([
                    colors[log?.mood as keyof typeof colors],
                    "mt-2 w-5 rounded-[40px]",
                  ])}
                  style={{
                    height: barHeight,
                    borderRadius: 6,
                    marginBottom: 4, // Space between bar and day label
                  }}
                />
              ) : (
                <Emoji name="circle" />
              )}

              {/* Day label */}
              <Text className="font-semibold text-neutral-400 text-xs">
                {day.dayOfWeek.substring(0, 3)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MoodInsight;
