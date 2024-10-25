// MonthlyMoodChart.tsx
import React from "react";
import { View, Text, Dimensions } from "react-native";
import Emoji from "../Core/Emoji";

import { getDaysInMonth, startOfMonth } from "date-fns"; // Import date-fns functions
import { MoodLog } from "./Mood";

const screenWidth = Dimensions.get("window").width;

// Create an array for the days of the week
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthlyMoodChartProps {
  moodLogs: MoodLog[];
  month: number;
  year: number;
}

const MonthlyMoodChart: React.FC<MonthlyMoodChartProps> = ({
  moodLogs,
  month,
  year,
}) => {
  const daysInMonth = getDaysInMonth(new Date(year, month));

  // Calculate the starting day of the month (0 = Sunday, 1 = Monday, ...)
  const startDay = new Date(year, month, 1).getDay();

  // Create an array for the days to render, filling in empty slots for alignment
  const daysToRender = Array.from({ length: daysInMonth + startDay }).map(
    (_, index) => {
      if (index < startDay) {
        return null; // Fill the first few slots with nulls
      }
      const day = index - startDay + 1; // Calculate the actual day of the month
      return {
        day,
        log: moodLogs.find(
          (moodLog) =>
            new Date(moodLog.date).getDate() === day &&
            new Date(moodLog.date).getMonth() === month &&
            new Date(moodLog.date).getFullYear() === year
        ),
      };
    }
  );

  return (
    <View className="mx-auto  -mt-[30]">
      <View className="flex-row w-full flex-wrap flex-1 ">
        {daysToRender.map((item, index) => {
          return (
            <View
              key={index}
              className="w-full items-center"
              style={{
                width: screenWidth / 8 - 4,
                height: 40,
              }}
            >
              {item ? (
                <>
                  {item.log ? (
                    <Emoji name={`${item.log.mood}-active`} />
                  ) : (
                    <Emoji name="circle" />
                  )}
                </>
              ) : (
                <View />
              )}
            </View>
          );
        })}
      </View>

      {/* Render Days of the Week */}
      <View className="flex-row ">
        {daysOfWeek.map((day, index) => (
          <View style={{ width: screenWidth / 8 - 4 }}>
            <Text
              className="font-fwbold text-sm text-neutral-400 text-center "
              key={index}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MonthlyMoodChart;
