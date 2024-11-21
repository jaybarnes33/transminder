import React from "react";
import { Text, ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useSWR from "swr";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import clsx from "clsx";

import Heading from "../Core/Heading";
import axiosInstance from "@/lib/axios";
import {
  checkIntakeForDays,
  checkLogsForDays,
  getAverageMood,
  getIntakeStatus,
  getLastNDaysWithDayInitials,
} from "@/utils";
import { moodColors } from "@/constants";
import EmptyIntake from "./Empty/EmptyIntake";
import EmptyTrack from "./Empty/EmptyTrack";
import { IconName, IntakeStat } from "@/types/global";
import Icon from "../Core/Icon";

interface TrackProps {
  noHeading?: boolean;
}

const Track: React.FC<TrackProps> = ({ noHeading = false }) => {
  const navigation = useNavigation();

  const getLogData = async () => {
    const { data } = await axiosInstance.get("/mood");
    return data;
  };

  const getIntakeData = async () => {
    const { data } = await axiosInstance.get("/drugs/intake/analytics");
    return data;
  };

  const { data: moodData, isLoading: loadingMood } = useSWR(
    "/mood",
    getLogData
  );
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

  const renderIntakeSection = () => {
    if (loadingIntake) {
      return (
        <View className="my-4">
          <ActivityIndicator />
        </View>
      );
    }

    if (!intakeData?.analytics.totalIntakes) {
      return <EmptyIntake />;
    }

    return (
      <View className="mt-2 bg-white h-[108] rounded-[20px] p-4 shadow-sm gap-y-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-main text-base">Medication Plan</Text>
          <Text className="font-semibold text-neutral-400 text-base">
            Last 7 days
          </Text>
        </View>
        <Text className="text-xl font-fwbold">
          {intakeData.analytics.taken}/{intakeData.analytics.totalIntakes}
          &nbsp;intake
        </Text>
        <View className="flex-row gap-x-2 items-center">
          <Text
            className={clsx([
              "font-fwbold text-sm capitalize",
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
                intakeData.analytics.totalIntakes - intakeData.analytics.pending
              )[0]
            }
          </Text>
        </View>
        <View className="flex-row absolute gap-x-1 bottom-4 right-4">
          {checkIntakeForDays(intakeData.intakes, days).map((d, index) => (
            <View
              className="items-center gap-y-1"
              key={`${d.dayOfWeek}-${index}`}
            >
              <View>
                {d.hasIntake ? (
                  <Icon name={d.status as IconName} />
                ) : (
                  <Icon name="pending" />
                )}
              </View>
              <Text className="font-semibold text-neutral-400">
                {d.dayOfWeek.charAt(0)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMoodSection = () => {
    if (loadingMood) {
      return (
        <View className="my-4">
          <ActivityIndicator />
        </View>
      );
    }

    if (!moodData || moodData.logs?.length === 0) {
      return <EmptyTrack />;
    }

    return (
      <View className="mt-2 bg-white h-[108] rounded-[20px] p-4 shadow-sm gap-y-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-main text-base">Well-being</Text>
          <Text className="font-semibold text-base text-neutral-400">
            Last 7 days
          </Text>
        </View>
        <Text className="text-xl font-fwbold">
          {moodData.averageMoodScore
            ? getAverageMood(moodData.averageMoodScore)[1]
            : "Not enough data"}
        </Text>
        <Text className={clsx("text-red-400 font-fwbold text-sm")}>
          <MaterialCommunityIcons
            name="information"
            size={14}
            className="mr-2"
          />
          &nbsp;
          {getAverageMood(moodData.averageMoodScore)[0]}
        </Text>

        <View className="flex-row absolute gap-x-2 bottom-4 right-4">
          {checkLogsForDays(moodData.logs, days).map((d, index) => (
            <View
              className="items-center gap-y-1"
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
    );
  };

  return (
    <View>
      {!noHeading && <Heading text="Keep Track" description="Last 7 days" />}
      {renderIntakeSection()}
      {renderMoodSection()}
    </View>
  );
};

export default Track;
