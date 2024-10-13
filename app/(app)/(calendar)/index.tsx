import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Back from "@/components/Core/Back";
import { Calendar, DateData } from "react-native-calendars";
import Appointments from "@/components/Calendar/Appointments";
import {
  format as formatDate,
  getMonth,
  getYear,
  addMonths,
  subMonths,
} from "date-fns";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import clsx from "clsx";
import useSWR, { mutate } from "swr";
import axiosInstance from "@/lib/axios";
import { IEvent } from "@/types/global";
import { eventColors } from "@/constants";

const Day = ({
  date,
  isActive,
  onPress,
  events,
}: {
  date: DateData;
  onPress: (date: string) => void;
  isActive: boolean;
  events?: Pick<IEvent, "_id" | "date" | "category" | "repeats">[];
}) => {
  console.log({ events });
  return (
    <TouchableOpacity
      className={clsx([
        "h-11 w-11 items-center justify-center rounded-full",
        isActive && "bg-ring",
      ])}
      onPress={() => date && onPress(date?.dateString)}
    >
      <Text
        className={clsx([
          "font-main text-base",
          isActive && "text-white font-fwbold",
        ])}
      >
        {date?.day}
      </Text>
      <View className="flex-row">
        {events?.slice(0, 3).map((e) => (
          <View
            key={e._id}
            className={clsx(
              "h-1 w-1 mr-[2px] rounded-full border p-[0.2]",
              e.category !== "event" && eventColors[e.category]?.border
            )}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const Wrapper: React.FC = () => {
  const [day, setDay] = useState<string>(new Date().toISOString());
  const [month, setMonth] = useState<number>(getMonth(new Date()) + 1); // Month is 1-indexed
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { navigate } = useRouter();

  // Fetch events for the current month and year
  const { data: events, isLoading } = useSWR<
    Pick<IEvent, "_id" | "date" | "category" | "repeats">[]
  >(`/events/month?month=${month}&year=${year}`, async () => {
    const { data } = await axiosInstance.get(
      `/events/month?month=${month}&year=${year}`
    );
    return data.events;
  });

  const handleMonthChange = (newDate: Date) => {
    const newMonth = getMonth(newDate) + 1; // Update month and account for 0-indexing
    const newYear = getYear(newDate); // Update the year

    setMonth(newMonth);
    setYear(newYear);
    setDay(new Date(newYear, newMonth - 1, 1).toISOString()); // Reset the day to the first day of the new month
    mutate(`/events/month?month=${newMonth}&year=${newYear}`);
  };

  // Custom header for the calendar
  const renderCustomHeader = (date: Date) => {
    const currentMonth = new Date(date.toString());
    return (
      <View className="flex-row h-8">
        <Text className="font-fwbold text-base">
          {formatDate(currentMonth, "MMMM yyyy")}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="px-4">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />
      <View className="flex-row justify-between items-center">
        <Back />
        <Text className="font-main flex-1 text-center text-base">Calendar</Text>
      </View>

      <View className="mt-4">
        {isLoading && <ActivityIndicator />}

        <Calendar
          onDayPress={(date) => setDay(date.dateString)}
          onMonthChange={(date) => handleMonthChange(new Date(date.dateString))}
          style={styles.calendar}
          enableSwipeMonths
          hideExtraDays
          date={day}
          renderArrow={(direction) => (
            <View
              className={clsx([
                "-top-1",
                direction === "left" && " left-[65vw]",
              ])}
            >
              <Feather
                name={`chevron-${direction}`}
                size={24}
                color={"#bb5adf"}
              />
            </View>
          )}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
          }}
          renderHeader={() => renderCustomHeader(new Date(day))} // Apply custom header
          dayComponent={({ date }) =>
            date && (
              <Day
                date={date}
                onPress={setDay}
                events={events?.filter(
                  (event) => event.date.split("T")[0] === date.dateString
                )}
                isActive={day.split("T")[0] === date.dateString}
              />
            )
          }
        />

        <View>
          <View className="flex-row mt-4 items-center justify-between">
            <Text className="text-xl font-fwbold">
              {formatDate(
                day ? new Date(day) : new Date(),
                "EEEE, dd MMMM yyyy"
              )}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigate({
                  pathname: "/(app)/(calendar)/add",
                  params: { date: day },
                })
              }
            >
              <Feather name="plus" size={20} color={"#bb5adf"} />
            </TouchableOpacity>
          </View>
          <Appointments limitted date={day} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
  calendar: {
    backgroundColor: "transparent",
  },
});

export default Wrapper;
