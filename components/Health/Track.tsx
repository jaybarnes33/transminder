import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import Heading from "../Core/Heading";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import { Skeleton } from "@rneui/themed";
import {
  checkIntakeForDays,
  checkLogsForDays,
  getAverageMood,
  getIntakeStatus,
  getLastNDaysWithDayInitials,
} from "@/utils";
import clsx from "clsx";
import { moodColors } from "@/constants";
import EmptyIntake from "./Empty/EmptyIntake";
import EmptyTrack from "./Empty/EmptyTrack";
import { icons } from "@/constants/icons";
import { Intake, IntakeStat } from "@/types/global";

const Track = () => {
  const getLogData = async () => {
    const { data } = await axiosInstance.get("/mood");
    console.log({ mood: data });
    return data;
  };

  const { data, isLoading: loadingMood } = useSWR("/mood", getLogData);

  const getIntakeData = async () => {
    const { data } = await axiosInstance.get("/drugs/intake/analytics");
    console.log({ mood: data });
    return data;
  };

  const { data: intakeData, isLoading: loadingIntake } = useSWR<{
    intakes: IntakeStat[];
    analytics: {
      pending: number;
      skipped: number;
      taken: number;
      totalIntakes: number;
    };
  }>("/intake/analytics", getIntakeData);

  const days = getLastNDaysWithDayInitials(7);

  return (
    <View>
      <Heading text="Keep Track" description="Last 7 days" />

      {!loadingIntake ? (
        intakeData?.analytics.totalIntakes ? (
          <View className="mt-2 bg-white h-[108] rounded-[20px] p-4 shadow-sm space-y-1">
            <View className="flex-row  justify-between items-center">
              <Text className="font-main text-base">Medication Plan</Text>
              <Text className="font-semibold text-neutral-400 text-base">
                Last 7 days
              </Text>
            </View>
            <Text className="text-xl font-fwbold">
              {intakeData?.analytics?.taken} /{" "}
              {intakeData?.analytics?.totalIntakes}
            </Text>
            <View className="flex-row  space-x-2 items-center">
              <Text
                className={clsx([
                  "font-fwbold text-sm capitalize",
                  ,
                  getIntakeStatus(
                    intakeData.analytics.taken,
                    intakeData.analytics.totalIntakes
                  )[1],
                ])}
              >
                <Octicons name="check-circle-fill" size={14} />
                &nbsp;
                {
                  getIntakeStatus(
                    intakeData.analytics.taken,
                    intakeData.analytics.totalIntakes
                  )[0]
                }
              </Text>
            </View>
            <View className="flex-row absolute space-x-2 bottom-4 right-4">
              {checkIntakeForDays(intakeData.intakes, days).map((d, index) => (
                <View
                  className=" items-center space-y-1"
                  key={`${d.dayOfWeek}-${index}`}
                >
                  <View>
                    {d.hasIntake ? (
                      icons[d.status as keyof typeof icons]
                    ) : (
                      <Entypo name="dot-single" color={"#6b7280"} />
                    )}
                  </View>
                  <Text className="font-semibold text-neutral-400">
                    {d.dayOfWeek.charAt(0)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <EmptyIntake />
        )
      ) : (
        <View className="my-4">
          <ActivityIndicator />
        </View>
      )}

      {!loadingMood && data ? (
        data.logs?.length ? (
          <View className="mt-2 bg-white h-[108] rounded-[20px] p-4 shadow-sm space-y-1">
            <View className="flex-row  justify-between items-center">
              <Text className="font-main text-base">Well-being</Text>
              <Text className="font-semibold text-base text-neutral-400">
                Last 7 days
              </Text>
            </View>
            <Text className="text-xl font-fwbold">
              {data?.averageMoodScore
                ? getAverageMood(data.averageMoodScore)[1]
                : "Not enough data"}
            </Text>
            <Text className={clsx(" text-red-400 font-fwbold text-sm")}>
              <MaterialCommunityIcons
                name="information"
                size={14}
                className="mr-2"
              />
              &nbsp;
              {getAverageMood(data.averageMoodScore)[0]}
            </Text>

            <View className="flex-row absolute space-x-2 bottom-4 right-4">
              {checkLogsForDays(data.logs, days).map((d, index) => (
                <View
                  className="items-center space-y-1"
                  key={`${d.dayOfWeek}-${index}`}
                >
                  <View
                    className={clsx([
                      "h-2 w-2 rounded-full",
                      moodColors[d.mood as keyof typeof moodColors],
                    ])}
                  />
                  <Text className="font-semibold text-neutral-400">
                    {d.dayOfWeek.charAt(0)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <EmptyTrack />
        )
      ) : (
        <View className="my-4">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default Track;
