import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import {
  ChevronDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar1,
} from "lucide-react-native";
import {
  format,
  addMonths,
  subMonths,
  formatRelative,
  startOfDay,
} from "date-fns";
import FrequencyPicker from "../Core/FrequencyPicker";

import { Image } from "react-native";
import { DatePicker } from "../nativewindui/DatePicker";
import { useBottomSheetModal } from "@/context/BottomSheet";

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

interface Time {
  hours: number;
  minutes: number;
}

interface CustomHeaderProps {
  date: string;
  onMonthChange: (date: Date) => void;
  onPressNext: () => void;
  onPressPrev: () => void;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
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
          {format(currentDate, "MMMM yyyy")}
        </Text>
        <ChevronDown size={20} className="text-purple-500 ml-1 " />
      </TouchableOpacity>

      <View className="flex-row gap-4">
        <TouchableOpacity onPress={onPressPrev}>
          <ChevronLeft size={24} className="text-purple-400" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressNext}>
          <ChevronRight size={24} className="text-purple-400" />
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

const ReminderSetup = ({
  onChange,
}: {
  onChange: (reminder: {
    date: string;
    time: string;
    repeat: string;
    repeatFrequency: number;
  }) => void;
}) => {
  const [reminder, setReminder] = useState({
    date: "",
    time: new Date().toISOString(),
    repeat: "",
    repeatFrequency: 1,
  });
  const handleChange = (key: string, value: string | number) => {
    setReminder((prev) => ({ ...prev, [key]: value }));
  };
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { dismissModal } = useBottomSheetModal();
  const handleFreq = ({
    value,
    frequency,
  }: {
    value: string;
    frequency?: number;
  }) => {
    handleChange("repeat", value);
    frequency && handleChange("repeatFrequency", frequency);
  };

  const markedDates: {
    [key: string]: { selected: boolean; selectedColor: string };
  } = {
    [selectedDate.toISOString().split("T")[0]]: {
      selected: true,
      selectedColor: "#a855f7",
    },
  };

  const handleDayPress = useCallback((day: DateData) => {
    if (new Date(day.dateString) < startOfDay(new Date())) {
      return;
    }
    setSelectedDate(new Date(day.timestamp));
    handleChange("date", new Date(day.timestamp).toISOString());
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(new Date(date)); // Create a new Date object to force re-render
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  }, []);

  const handleDismiss = () => {
    onChange(reminder);

    dismissModal();
  };
  return (
    <ScrollView className="p-4">
      <View className="bg-gray-100 rounded-xl overflow-hidden mb-6">
        <View className="mb-6 flex-row px-4 py-4 relative">
          <Text className="text-base font-fwbold text-gray-400">
            Start Date
          </Text>

          <View className="flex-1 flex-row items-center justify-end gap-x-2">
            <Calendar1 className="text-purple-500 " size={17} />
            <Text className="capitalize text-base font-semibold ">
              {formatRelative(new Date(selectedDate), new Date()).split(" ")[0]}
            </Text>
          </View>
          <Image
            className="absolute left-4 -bottom-2 w-full"
            source={require("@/assets/images/line.png")}
          />
        </View>
        <Calendar
          key={currentMonth.toISOString()}
          current={currentMonth.toISOString()}
          onDayPress={handleDayPress}
          hideExtraDays
          markedDates={markedDates}
          customHeader={() => (
            <CustomHeader
              date={currentMonth.toISOString()}
              onMonthChange={handleMonthChange}
              onPressNext={handleNextMonth}
              onPressPrev={handlePrevMonth}
            />
          )}
          theme={{
            calendarBackground: "transparent",
            backgroundColor: "transparent",
            textSectionTitleColor: "#9ca3af",
            selectedDayBackgroundColor: "#a855f7",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#a855f7",
            dayTextColor: "#1f2937",
            textDisabledColor: "#d1d5db",
            dotColor: "#a855f7",
            selectedDotColor: "#ffffff",
            arrowColor: "#a855f7",
            monthTextColor: "#1f2937",
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "400",
            textMonthFontWeight: "700",
            textDayHeaderFontWeight: "400",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
        />
      </View>

      <View className="gap-y-2 mb-4">
        <View className="bg-neutral-200 flex-row items-center h-[50px] rounded-lg justify-between py-2 px-2">
          <FrequencyPicker handleChange={handleFreq} />
        </View>
        <View className="bg-neutral-200 flex-row items-center h-[50px] rounded-xl justify-between py-2 px-2">
          <Text className="  font-semibold">Time</Text>

          <View className="ml-auto flex-row items-center gap-x-1">
            <Clock size={16} className="text-purple-500" />
            <DatePicker
              mode="time"
              value={new Date(reminder.time)}
              onChange={(event, date) => {
                if (event.type === "set" && date) {
                  handleChange("time", date.toISOString());
                }
              }}
            />
          </View>
          <ChevronDown size={20} className="text-gray-400" />
        </View>
      </View>

      <Pressable
        className="bg-purple-500 h-[50px] rounded-full items-center justify-center"
        onPress={handleDismiss}
      >
        <Text className="text-white font-fwbold text-base">Confirm</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ReminderSetup;
