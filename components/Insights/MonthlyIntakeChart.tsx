// MonthlyMoodChart.tsx
import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Emoji from "../Core/Emoji";

import { getDaysInMonth, startOfMonth } from "date-fns"; // Import date-fns functions
import { IntakeAnalytics } from "./Intake";
import Icon from "../Core/Icon";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import clsx from "clsx";

const screenWidth = Dimensions.get("window").width;

// Create an array for the days of the week
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthlyIntakeChartProps {
  intakes: IntakeAnalytics["intakes"];
  month: number;
  year: number;
  taken: number;
  skipped: number;
  missed: number;
  total: number;
  pending: number;
}

const MonthlyIntakeChart: React.FC<MonthlyIntakeChartProps> = ({
  intakes,
  month,
  year,
  taken,
  skipped,
  missed,
  total,
  pending,
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
      const log = intakes.find(
        (intake) =>
          new Date(intake.date).getDate() === day &&
          new Date(intake.date).getMonth() === month &&
          new Date(intake.date).getFullYear() === year
      );

      // Determine the highest count status if log exists
      const status = log
        ? (() => {
            console.log();
            const { taken, skipped, missed } = log;
            if (taken >= skipped && taken >= missed) return "taken";
            if (skipped > taken && skipped >= missed) return "skipped";
            if (missed > taken && missed >= skipped) return "missed";
            return "pending";
          })()
        : "pending"; // Default to "pending" if no log found for the day

      return {
        day,
        log: status,
      };
    }
  );

  return (
    <View className="mx-auto h-[30vh]  mt-4">
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
                    <>
                      {item.log === "taken" && (
                        <Text className="text-blue-400">
                          <Octicons name="check-circle-fill" size={24} />
                        </Text>
                      )}
                      {item.log === "skipped" && (
                        <Text className="text-red-400">
                          <Octicons name="check-circle-fill" size={24} />
                        </Text>
                      )}
                      {item.log === "missed" && (
                        <Text className="text-red-400">
                          <Octicons name="check-circle-fill" size={24} />
                        </Text>
                      )}
                      {item.log === "pending" && <Emoji name="circle" />}
                    </>
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
      <View className=" flex-row pt-2 mt-3 justify-around">
        <Image
          source={require("@/assets/images/line.png")}
          className={clsx(["w-full left-0 absolute top-[0px]"])}
        />
        <View className="items-center">
          <Text className="font-fwbold text-sm">
            {taken}/{total}
          </Text>
          <Text className="font-semibold text-xs text-green-500">
            Taken <Octicons name="check-circle-fill" size={12} />
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-fwbold text-sm">
            {missed}/{total}
          </Text>
          <View className="flex-row items-center space-x-1">
            <Text className="font-fwbold text-xs text-red-400">Missed</Text>
            <Ionicons
              name="alert-circle"
              size={14}
              className="mt-1"
              color={"#f87171"}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonthlyIntakeChart;
