// WeeklyMoodChart.tsx
import React from "react";
import { View, Text } from "react-native";
import Emoji from "../Core/Emoji";

import clsx from "clsx";
import { MoodLog } from "./Mood";

interface WeeklyMoodChartProps {
  moodLogs: MoodLog[];
  daysOfWeek: { dayOfWeek: string }[];
  colors: Record<string, string>;
  moodMapping: Record<string, number>;
  chartHeight: number;
}

const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({
  moodLogs,
  daysOfWeek,
  colors,
  moodMapping,
  chartHeight,
}) => {
  return (
    <View
      style={{
        height: chartHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {daysOfWeek.map((day, index) => {
        const logs = moodLogs.filter(
          (log) => log.dayOfWeek.toLowerCase() === day.dayOfWeek.toLowerCase()
        );

        return (
          <View
            key={day.dayOfWeek + index}
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 4,
            }}
            className="h-full"
          >
            {logs && logs.length > 0 ? (
              logs.map((log, logIndex) => {
                const moodScore = moodMapping[log.mood];
                const barHeight = (moodScore / 5) * chartHeight;

                return (
                  <View key={logIndex} style={{ alignItems: "center" }}>
                    <View>
                      <Emoji name={`${log.mood}-active`} />
                    </View>
                    <View
                      className={clsx([
                        colors[log.mood as keyof typeof colors],
                        "mt-2 w-5 rounded-[40px]",
                      ])}
                      style={{
                        height: barHeight,
                        borderRadius: 6,
                        marginBottom: 4,
                      }}
                    />
                  </View>
                );
              })
            ) : (
              <Emoji name="circle" />
            )}
            <View>
              <Text className="font-semibold text-neutral-400 text-xs">
                {day.dayOfWeek.substring(0, 3)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default WeeklyMoodChart;
