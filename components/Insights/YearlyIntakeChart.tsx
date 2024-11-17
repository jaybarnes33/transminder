import React from "react";
import { View, Text, Image } from "react-native";
import EmptyInsight from "./Empty";
import clsx from "clsx";
import { PieChart } from "react-native-svg-charts";
import Emoji from "../Core/Emoji";
import { IntakeAnalytics } from "./Intake";

interface YearlyIntakeChartProps {
  intakes: IntakeAnalytics["intakes"];
}

// Define colors object
export const colors = {
  taken: { text: "text-blue-500", bg: "#24b2ff" },
  missed: { text: "text-[#FD8C6C]", bg: "#FD8C6C" },
  pending: { text: "text-[#AFEBC4]", bg: "#AFEBC4" },
  skipped: { text: "text-dark", bg: "#1a1a1a" },
};

const YearlyIntakeChart: React.FC<YearlyIntakeChartProps> = ({ intakes }) => {
  // Aggregate intake counts
  const intakeCounts = {
    taken: 0,
    missed: 0,
    pending: 0,
    skipped: 0,
  };

  intakes.forEach((log) => {
    intakeCounts.taken += log.taken;
    intakeCounts.missed += log.missed;
    intakeCounts.pending += log.pending;
    intakeCounts.skipped += log.skipped;
  });

  const donutData = Object.entries(intakeCounts).map(
    ([status, count], index) => ({
      key: index,
      value: count,
      svg: {
        fill: colors[status as keyof typeof colors]?.bg || "#000", // Fallback color
        cornerRadius: 10,
      },
    })
  );

  // Donut chart render function
  const renderDonutChart = () => (
    <PieChart
      style={{ height: 150, width: 150 }}
      data={donutData}
      innerRadius={65}
      outerRadius={75}
      padAngle={0.02}
    />
  );

  return intakes.length === 0 ? (
    <EmptyInsight
      label="Medication Intake"
      heading="Track your intake"
      showEmojis
      description="No intakes logged yet. Start tracking to see insights and view your yearly intake here."
    />
  ) : (
    <View className="gap-y-3  my-3">
      <View className="flex-row items-center">
        {/* Donut chart */}
        <View className="mx-5">{renderDonutChart()}</View>
        <View className="flex-1">
          {Object.entries(intakeCounts).map(([status, count], index) => (
            <View
              key={status}
              className="flex-row gap-x-2 items-center justify-between flex-1"
            >
              <Emoji name={`${status}-active`} />
              <Text className="font-semibold flex-1 text-dark capitalize">
                {status}
              </Text>
              <Text
                className={clsx([
                  "font-fwbold text-dark capitalize",
                  colors[status as keyof typeof colors]?.text || "text-black",
                ])}
              >
                {count}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Image source={require("@/assets/images/line.png")} className="w-full" />
      <Text className="font-semibold text-neutral-400 text-xs">
        Your intake tracked throughout the year.
      </Text>
    </View>
  );
};

export default YearlyIntakeChart;
