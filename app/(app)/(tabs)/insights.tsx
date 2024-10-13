import { ScrollView, Text, View, VirtualizedList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyInsight from "@/components/Health/Empty/Insight";
import { getDaysOfWeek } from "@/utils";
import { format } from "date-fns";

const Insights = () => {
  const week = getDaysOfWeek();

  const sections = [
    {
      key: "intake",
      component: (
        <EmptyInsight
          label="Log your meds"
          heading="Medication Intake"
          description="No meds logged yet. Start tracking to gain insights into your intake patterns and progress here."
        />
      ),
    },
    {
      key: "well-being",
      component: (
        <EmptyInsight
          label="Log your moods"
          heading="Well-being"
          showEmojis
          description="Nothing logged yet. Start tracking to gain insights into your emotional patterns and well-being here."
        />
      ),
    },
    {
      key: "mental health",
      component: (
        <EmptyInsight
          label="Log your emotions"
          heading="Mental health"
          description="No emotions logged yet. Start tracking to see insights and view your top five emotions here."
        />
      ),
    },
  ];

  const getItem = (data: typeof sections, index: number) => data[index];

  const getItemCount = (data: typeof sections) => data.length;

  return (
    <SafeAreaView className="p-4">
      <View className="mb-4">
        <View>
          <Text className="font-fwbold text-xl">This week</Text>
          <Text>
            {format(week[0].date, "MMMM dd")} -{" "}
            {format(week[6].date, "MMMM dd")}{" "}
          </Text>
        </View>
      </View>
      <VirtualizedList
        data={sections}
        contentContainerStyle={{ paddingBottom: 40 }}
        initialNumToRender={4}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.key}
        getItem={getItem}
        getItemCount={getItemCount}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Insights;
