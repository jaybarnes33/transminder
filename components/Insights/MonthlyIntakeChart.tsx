import React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Emoji from "../Core/Emoji";
import { getDaysInMonth } from "date-fns"; // Import date-fns functions
import { IntakeAnalytics } from "./Intake";
import { Octicons, Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { getDaysOfWeek } from "@/utils";

const screenWidth = Dimensions.get("window").width;

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
  let startDay = new Date(year, month, 1).getDay();
  startDay = (startDay + 6) % 7; // Adjust so that Monday is the first day of the week

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
            const { taken, skipped, missed } = log;
            if (taken >= skipped && taken >= missed && taken !== 0)
              return "taken";
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
    <View className="mx-auto min-h-[35vh] mt-4">
      <View className="flex-row w-full flex-wrap flex-1">
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
      <View className="flex-row">
        {getDaysOfWeek().map((day, index) => (
          <View key={index} style={{ width: screenWidth / 8 - 4 }}>
            <Text className="font-fwbold text-sm text-neutral-400 text-center">
              {day.dayOfWeek}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row pt-2 mt-3 justify-around">
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
          <View className="flex-row items-center gap-x-1">
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
