import { ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

import IntakeInsight from "@/components/Insights/Intake";
import MoodInsight from "@/components/Insights/Mood";
import FeelingsInsight from "@/components/Insights/Feelings";
import Track from "@/components/Health/Track";
import HealthReport from "@/components/Insights/HealthReport";
import { Actions } from "@/components/Core/Header";
import DropdownPicker from "@/components/Core/Dropdown";
import { mutate } from "swr";

const Insights = () => {
  const [range, setRange] = useState<{
    label: string;
    value: string;
    startDate: Date;
    endDate: Date;
  }>({
    label: "This Week",
    value: "week",
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  });

  const onChange = (val: { label: string; value: string }) => {
    let startDate, endDate;

    const date = new Date();

    switch (val.value) {
      case "month":
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      case "week":
        startDate = startOfWeek(date);
        endDate = endOfWeek(date);
        break;
      case "year":
        startDate = startOfYear(date);
        endDate = endOfYear(date);
        break;
      case "all":
        startDate = new Date(0); // Unix epoch start for "all time"
        endDate = date;
        break;
      default:
        startDate = startOfWeek(date);
        endDate = endOfWeek(date);
        break;
    }

    setRange({
      ...val,
      startDate,
      endDate,
    });
  };

  useEffect(() => {
    (async () => {
      await Promise.all([mutate("/mood-insights"), mutate("/insights/med")]);
    })();
  }, [range]);
  return (
    <SafeAreaView className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <DropdownPicker
            width={192}
            range
            placeholder="Select range"
            selectedValue={range}
            handleChange={onChange}
            data={[
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
              { label: "This Year", value: "year" },
              { label: "All time", value: "all" },
            ]}
          />
          <Text>
            {format(range.startDate, "MMMM d")} -{" "}
            {format(range.endDate, "MMMM d")}
          </Text>
        </View>
        <Actions />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 270 }}
      >
        <MoodInsight
          start={range.startDate}
          end={range.endDate}
          range={range.value}
        />

        <IntakeInsight
          start={range.startDate}
          end={range.endDate}
          range={range.value}
        />

        <FeelingsInsight start={range.startDate} end={range.endDate} />
        <Track noHeading />
        <HealthReport start={range.startDate} end={range.endDate} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
