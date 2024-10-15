import { View, Text, Image } from "react-native";
import React from "react";
import Emoji from "@/components/Core/Emoji"; // Assuming this is a custom emoji component
import clsx from "clsx";
import { getLastNDaysWithDayInitials } from "@/utils";
import { Ionicons, Octicons } from "@expo/vector-icons";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyInsight from "./Empty";

interface IntakeAnalytics {
  intakes: {
    dayOfWeek: string;
    intakes: {
      name: string;
      type: string;
      id: string;
      total: number;
      taken: number;
    }[];
  }[];
  drugs: {
    id: string;
    name: string;
    type: string;
    total: number;
    taken: number;
  }[];
}

const IntakeInsight = () => {
  // Helper function to find intakes for a specific day

  const fetchData = async () => {
    const { data } = await axiosInstance.get("/insights/meds");
    return data;
  };

  const { data, isLoading, error } = useSWR<IntakeAnalytics>(
    "/insights/med",
    fetchData
  );

  const getIntakesForDay = (dayOfWeek: string) => {
    const intakeForDay = data?.intakes?.find(
      (intake) => intake.dayOfWeek.substring(0, 3) === dayOfWeek
    );
    return intakeForDay ? intakeForDay.intakes : [];
  };

  return isLoading || !data?.intakes.length ? (
    <EmptyInsight
      label="Log your meds"
      heading="Medication Intake"
      description="No meds logged yet. Start tracking to gain insights into your intake patterns and progress here."
    />
  ) : (
    <View className="bg-white mb-4 shadow rounded-[20px] p-4 space-y-4">
      <Text className="font-semibold text-base">Medication intake</Text>

      {/* Days of the week and circles */}
      <View className="flex-row justify-between relative py-2">
        {getLastNDaysWithDayInitials(7).map((item) => {
          const dayIntakes = getIntakesForDay(item.dayOfWeek);

          return (
            <View
              key={item.date}
              className="items-center space-y-2 flex-grow justify-end"
            >
              <View className="justify-center items-end space-y-2">
                {dayIntakes.length > 0 ? (
                  dayIntakes.map((intake) => {
                    // Create an array with 'taken' number of checkmarks and 'total - taken' number of dashed circles
                    const checkmarks = Array(intake.taken).fill(
                      <Text className="text-blue-400" key={intake.id}>
                        <Octicons name="check-circle-fill" size={24} />
                      </Text>
                    );
                    const uncompleted = Array(intake.total - intake.taken).fill(
                      <View>
                        <Emoji key={intake.id} name="circle-dashed" />
                      </View>
                    );

                    return [...checkmarks, ...uncompleted].map(
                      (item, index) => <View key={index}>{item}</View>
                    );
                  })
                ) : (
                  // If there are no intakes for this day
                  <Emoji name="circle-dashed" />
                )}
              </View>

              {/* Day of the week label */}
              <Text className="font-semibold text-neutral-400">
                {item.dayOfWeek}
              </Text>
            </View>
          );
        })}

        <Image
          source={require("@/assets/images/line.png")}
          className={clsx(["w-full absolute -bottom-[6px]"])}
        />
      </View>

      {/* Drug intake summary */}
      <View className="my-3 space-y-2">
        {data?.drugs.map((drug) => (
          <View key={drug.id} className="flex-row justify-between items-center">
            <View>
              <Text className="font-semibold text-sm">{drug.name}</Text>
              <Text className="font-semibold text-xs text-neutral-400 capitalize">
                {drug.type}
              </Text>
            </View>
            <View>
              <Text className="font-fwbold text-sm">
                {drug.taken}/{drug.total} intake
              </Text>
              <Text className="font-fwbold text-xs">
                {drug.taken === drug.total ? (
                  <Text className="text-green-500">
                    Complete <Octicons name="check-circle-fill" />
                  </Text>
                ) : (
                  <Text className="text-red-400">
                    Incomplete <Ionicons name="alert-circle" />
                  </Text>
                )}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default IntakeInsight;
