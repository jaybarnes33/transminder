import { ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyInsight from "@/components/Insights/Empty";
import { getLastNDaysWithDayInitials } from "@/utils";
import { format } from "date-fns";

import IntakeInsight from "@/components/Insights/Intake";
import MoodInsight from "@/components/Insights/Mood";
import FeelingsInsight from "@/components/Insights/Feelings";
import Track from "@/components/Health/Track";
import HealthReport from "@/components/Insights/HealthReport";
import { Actions } from "@/components/Core/Header";

const Insights = () => {
  const week = getLastNDaysWithDayInitials(7);

  return (
    <SafeAreaView className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="font-fwbold text-xl">This week</Text>
          <Text>
            {format(week[0].date, "MMMM d")} - {format(week[6].date, "MMMM d")}{" "}
          </Text>
        </View>
        <Actions />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 270 }}
      >
        <MoodInsight />

        <IntakeInsight />

        <FeelingsInsight />
        <Track noHeading />
        <HealthReport />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
