import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
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
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import clsx from "clsx";
import useSWR, { mutate } from "swr";
import axiosInstance from "@/lib/axios";
import { IEvent } from "@/types/global";
import { eventColors } from "@/constants";
import { ChevronDown } from "lucide-react-native";

const MONTHS: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CustomHeaderProps {
  date: string;
  onMonthChange: (date: Date) => void;
  onPressNext: () => void;
  onPressPrev: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  date,
  onMonthChange,
  onPressNext,
  onPressPrev,
}) => {
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const currentDate = new Date(date);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handleMonthSelect = useCallback(
    (month: number) => {
      const newDate = new Date(currentYear, month, 1);
      onMonthChange(newDate);
      setShowMonthPicker(false);
    },
    [currentYear, onMonthChange]
  );

  return (
    <View className="flex-row justify-between items-center px-2 py-4">
      <TouchableOpacity
        onPress={() => setShowMonthPicker(true)}
        className="flex-row items-center"
      >
        <Text className="text-lg font-fwbold text-gray-900">
          {formatDate(currentDate, "MMMM yyyy")}
        </Text>
        <ChevronDown size={20} color="#a855f7" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      <View className="flex-row gap-4">
        <TouchableOpacity onPress={onPressPrev}>
          <Feather name="chevron-left" size={24} color="#a855f7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressNext}>
          <Feather name="chevron-right" size={24} color="#a855f7" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          onPress={() => setShowMonthPicker(false)}
        >
          <View className="m-4 mt-20 bg-white rounded-xl overflow-hidden">
            <ScrollView className="max-h-96">
              {MONTHS.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  className={`p-4 border-b border-gray-100 
                    ${index === currentMonth ? "bg-purple-50" : ""}`}
                  onPress={() => handleMonthSelect(index)}
                >
                  <Text
                    className={`text-base font-main 
                    ${
                      index === currentMonth
                        ? "text-purple-500"
                        : "text-gray-900"
                    }`}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
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
  const isPastDate = isBefore(
    parseISO(date.dateString),
    startOfDay(new Date())
  );

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
          isPastDate && "text-gray-400",
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
              e.category !== "event" && eventColors[e.category]?.border,
              isPastDate && "opacity-50"
            )}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const Wrapper: React.FC = () => {
  const [day, setDay] = useState<string>(new Date().toISOString());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { navigate } = useRouter();

  const fetchEvents = useCallback(async (month: number, year: number) => {
    const { data } = await axiosInstance.get(
      `/events/month?month=${month}&year=${year}`
    );
    return data.events;
  }, []);

  const {
    data: events,
    isLoading,
    mutate,
  } = useSWR<Pick<IEvent, "_id" | "date" | "category" | "repeats">[]>(
    `/events/month?month=${getMonth(currentMonth) + 1}&year=${getYear(
      currentMonth
    )}`,
    () => fetchEvents(getMonth(currentMonth) + 1, getYear(currentMonth))
  );

  const handleMonthChange = useCallback((newDate: Date) => {
    setCurrentMonth(newDate);
    setDay(newDate.toISOString());
  }, []);

  useEffect(() => {
    mutate();
  }, [currentMonth, mutate]);

  const handlePrevMonth = useCallback(() => {
    const newDate = subMonths(currentMonth, 1);
    handleMonthChange(newDate);
  }, [currentMonth, handleMonthChange]);

  const handleNextMonth = useCallback(() => {
    const newDate = addMonths(currentMonth, 1);
    handleMonthChange(newDate);
  }, [currentMonth, handleMonthChange]);

  const markedDates = useMemo(() => {
    if (!events) return {};

    return events.reduce((acc, event) => {
      const dateString = event.date.split("T")[0];
      if (!acc[dateString]) {
        acc[dateString] = { events: [] };
      }
      acc[dateString].events.push(event);
      return acc;
    }, {} as { [key: string]: { events: typeof events } });
  }, [events]);

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
          current={currentMonth.toISOString()}
          customHeader={() => (
            <CustomHeader
              date={currentMonth.toISOString()}
              onMonthChange={handleMonthChange}
              onPressNext={handleNextMonth}
              onPressPrev={handlePrevMonth}
            />
          )}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textDisabledColor: "#d1d5db",
          }}
          dayComponent={({ date }) =>
            date && (
              <Day
                date={date}
                onPress={setDay}
                events={markedDates[date.dateString]?.events}
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
              <Feather name="plus" size={20} color="#bb5adf" />
            </TouchableOpacity>
          </View>
          <Appointments date={day} />
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
