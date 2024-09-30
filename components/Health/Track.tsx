import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Heading from "../Core/Heading";
import { Ionicons, Octicons } from "@expo/vector-icons";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import { Skeleton } from "@rneui/themed";
import { checkLogsForDays, getLastNDaysWithDayInitials } from "@/utils";
import clsx from "clsx";

const Track = () => {
  const getLogData = async () => {
    const { data } = await axiosInstance.get("/mood");
    console.log({ mood: data });
    return data;
  };

  const { data, isLoading: loadingMood, error } = useSWR("/mood", getLogData);

  const moodScale = {
    5: "Mostly Awesome",
    4: "Mostly Good",
    3: "Mostly Okay",
    2: "Mostly Bad",
    1: "Mostly Terrible",
  };

  const moodColors = {
    terrible: "bg-red-500",
    bad: "bg-orange-500",
    okay: "bg-yellow-500",
    good: "bg-green-300",
    awesome: "bg-green-500",
    null: "bg-gray-400",
  };

  const days = getLastNDaysWithDayInitials(7);

  const isGood = data?.averageMoodScore > 2.5;
  return (
    <View>
      <Heading text="Keep Track" description="Last 7 days" />

      <View className="mt-2 bg-white h-[108] rounded-[20px] p-4 shadow-sm space-y-1">
        {!loadingMood ? (
          <>
            <View className="flex-row  justify-between items-center">
              <Text className="font-main text-base">Well-being</Text>
              <Text className="font-semibold text-base">Last 7 days</Text>
            </View>
            <Text className="text-xl font-fwbold">
              {data?.averageMoodScore
                ? moodScale[
                    Math.round(data.averageMoodScore) as keyof typeof moodScale
                  ]
                : "Not enough data"}
            </Text>
            <View className="flex-row  space-x-2 items-center">
              {isGood ? (
                <Octicons name="check-circle-fill" size={16} color="#46C17E" />
              ) : (
                <Ionicons name="alert-circle-sharp" size={16} color="#FD8C6C" />
              )}

              <Text
                className={clsx(
                  " text-[#FD8C6C] font-fwbold text-sm",
                  isGood && "text-[#46C17E]"
                )}
              >
                {isGood ? "Good" : "Find a balance"}
              </Text>
            </View>
            <View className="flex-row absolute space-x-2 bottom-4 right-4">
              {checkLogsForDays(data.logs, days).map((d) => (
                <View className="items-center space-y-1">
                  <View
                    className={clsx([
                      "h-2 w-2 rounded-full",
                      moodColors[d.mood as keyof typeof moodColors],
                    ])}
                  ></View>
                  <Text className="font-semibold text-gray-500">
                    {d.dayOfWeek}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Skeleton height={50} />
        )}
      </View>
    </View>
  );
};

export default Track;
