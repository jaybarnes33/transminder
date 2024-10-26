import { View, Text, Image } from "react-native";
import React from "react";
import Emoji from "@/components/Core/Emoji"; // Assuming this is a custom emoji component
import clsx from "clsx";
import { getDaysOfWeek, getLastNDaysWithDayInitials } from "@/utils";
import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyInsight from "./Empty";
import Icon from "../Core/Icon";
import WeeklyIntakeChart from "./WeeklyIntakeChart";
import MonthlyIntakeChart from "./MonthlyIntakeChart";
import YearlyIntakeChart from "./YearlyIntakeChart";

export interface IntakeAnalytics {
  intakes: {
    dayOfWeek: string;
    date: string;
    name: string;
    type: string;
    id: string;
    total: number;
    missed: number;
    skipped: number;
    pending: number;
    taken: number;
  }[];
  drugs: {
    id: string;
    name: string;
    type: string;
    total: number;
    taken: number;
  }[];

  stats: {
    taken: number;
    pending: number;
    skipped: number;
    missed: number;
    total: number;
  };
}

const IntakeInsight = ({
  start,
  end,
  range,
}: {
  start: Date;
  end: Date;
  range: "month" | "week" | "year" | "all" | string;
}) => {
  // Helper function to find intakes for a specific day

  const fetchData = async () => {
    const { data } = await axiosInstance.get(
      `/insights/meds?start=${start}&end=${end}`
    );
    console.log(JSON.stringify(data));
    return data;
  };

  const { data, isLoading, error } = useSWR<IntakeAnalytics>(
    "/insights/med",
    fetchData
  );
  // Get the year and month from the start date
  const month = start.getMonth(); // Month is 0-indexed (0 = January)
  const year = start.getFullYear();

  return isLoading || !data?.intakes.length ? (
    <EmptyInsight
      label="Log your meds"
      heading="Medication Intake"
      description="No meds logged yet. Start tracking to gain insights into your intake patterns and progress here."
    />
  ) : (
    <View className="bg-white mb-4 shadow rounded-[20px] p-4   space-y-4">
      <Text className="font-semibold text-base">Medication intake</Text>

      {range === "week" && (
        <WeeklyIntakeChart drugs={data.drugs} intakes={data.intakes} />
      )}
      {range === "month" && (
        <MonthlyIntakeChart
          month={month}
          year={year}
          intakes={data.intakes}
          {...data.stats}
        />
      )}

      {(range === "year" || range === "all") && (
        <YearlyIntakeChart intakes={data.intakes} />
      )}
    </View>
  );
};

export default IntakeInsight;
