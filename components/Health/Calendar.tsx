import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import {
  checkLogsForDays,
  getDaysOfWeek,
  getLastNDaysWithDayInitials,
  transformDate,
} from "@/utils";
import clsx from "clsx";
import { DayObj } from "@/types/global";
import { TouchableOpacity } from "react-native-gesture-handler";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate } from "swr";
import { moodColors } from "@/constants";

const Item = ({
  day,
  active,
  selectDay,
  disabled,
}: {
  selectDay: (day: DayObj) => void;
  day: DayObj & { hasLog: boolean; mood: string | null };
  active: boolean;
  disabled: boolean;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        mutate(`/mood/${day.date}`);
        selectDay(day);
      }}
      className={clsx([
        "items-center justify-center  w-[45px] h-[76px] rounded-3xl space-y-1",
        active && "bg-white",
      ])}
    >
      <Text
        className={clsx(
          "font-main text-xs font-semibold text-gray-500 uppercase",
          active && "text-dark font-fwbold"
        )}
      >
        {day.dayOfWeek}
      </Text>
      <Text
        className={clsx([
          "font-fwbold text-[20]",
          active ? "text-dark" : "text-gray-600",
        ])}
      >
        {day.dayOfMonth}
      </Text>

      <View
        className={clsx([
          " w-2 h-2 absolute bottom-1 rounded-full",
          moodColors[day.mood as keyof typeof moodColors],
          active && "bg-purple-500",
        ])}
      />
    </TouchableOpacity>
  );
};
const Calendar = ({
  day,
  setDay,
}: {
  setDay: (day: DayObj) => void;
  day: DayObj;
}) => {
  const fetchLog = async () => {
    const { data } = await axiosInstance.get("/mood");
    return data;
  };

  const today = transformDate(new Date());
  const { data, isLoading, error } = useSWR("/mood", fetchLog);

  return !isLoading ? (
    <View className="flex-row justify-between">
      {checkLogsForDays(data.logs, getLastNDaysWithDayInitials(7)).map(
        (item) => (
          <Item
            day={item}
            disabled={new Date(today.date) < new Date(item.date)}
            selectDay={() => setDay(item)}
            active={item.dayOfMonth === day.dayOfMonth}
            key={item.dayOfMonth}
          />
        )
      )}
    </View>
  ) : (
    <View className="flex-row justify-center">
      <ActivityIndicator />
    </View>
  );
};

export default Calendar;
