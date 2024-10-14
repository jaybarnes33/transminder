import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyInsight from "@/components/Insights/Empty";
import { getDaysOfWeek, getLastNDaysWithDayInitials } from "@/utils";
import { format } from "date-fns";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import IntakeInsight from "@/components/Insights/Intake";

const Insights = () => {
  const week = getLastNDaysWithDayInitials(7);

  const fetchData = async () => {
    const { data } = await axiosInstance.get("/insights");
    return data;
  };

  const { data, isLoading, error } = useSWR("insights", fetchData);

  return (
    <SafeAreaView className="p-4">
      <View className="mb-4">
        <View>
          <Text className="font-fwbold text-xl">This week</Text>
          <Text>
            {format(week[0].date, "MMMM d")} - {format(week[6].date, "MMMM d")}{" "}
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading && <ActivityIndicator />}
        <EmptyInsight
          label="Log your moods"
          heading="Well-being"
          showEmojis
          description="Nothing logged yet. Start tracking to gain insights into your emotional patterns and well-being here."
        />
        {isLoading || !data?.intake.intakes ? (
          <EmptyInsight
            label="Log your meds"
            heading="Medication Intake"
            description="No meds logged yet. Start tracking to gain insights into your intake patterns and progress here."
          />
        ) : (
          <IntakeInsight intake={data.intake} />
        )}
        <EmptyInsight
          label="Log your emotions"
          heading="Mental health"
          description="No emotions logged yet. Start tracking to see insights and view your top five emotions here."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
