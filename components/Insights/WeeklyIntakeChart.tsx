import { View, Text, Image } from "react-native";
import React from "react";
import { Ionicons, Octicons } from "@expo/vector-icons";
import clsx from "clsx";
import { getDaysOfWeek } from "@/utils";
import { IntakeAnalytics } from "./Intake";
import Emoji from "../Core/Emoji";

const WeeklyIntakeChart = ({
  intakes,
  drugs,
}: {
  intakes: IntakeAnalytics["intakes"];
  drugs: IntakeAnalytics["drugs"];
}) => {
  const getIntakesForDay = (dayOfWeek: string) => {
    const intakeForDay = intakes?.filter(
      (intake) => intake.dayOfWeek.substring(0, 3) === dayOfWeek
    );
    return intakeForDay ? intakeForDay : [];
  };

  return (
    <View>
      {/* Days of the week and circles */}
      <View className="flex-row justify-between relative py-2">
        {getDaysOfWeek().map((item) => {
          const dayIntakes = getIntakesForDay(item.dayOfWeek);
          console.log({ dayIntakes });
          return (
            <View
              key={item.date}
              className="items-center gap-y-2 flex-grow justify-end"
            >
              <View className="justify-center items-end gap-y-2">
                {dayIntakes.length > 0 ? (
                  dayIntakes.map((intake) => {
                    // Create an array with 'taken', 'missed', and 'skipped' representations
                    const checkmarks = Array(intake.taken).fill(
                      <Text className="text-blue-400" key={intake.id}>
                        <Octicons name="check-circle-fill" size={24} />
                      </Text>
                    );

                    const missedIcons = Array(intake.missed).fill(
                      <Emoji name="circle-dashed" />
                    );

                    const skippedIcons = Array(intake.skipped).fill(
                      <Ionicons
                        name="close-circle-sharp"
                        size={24}
                        color={"gray"}
                        key={intake.id}
                      />
                    );

                    // Remaining uncompleted intakes will be displayed as dashed circles
                    const uncompleted = Array(
                      intake.total -
                        intake.taken -
                        intake.missed -
                        intake.skipped
                    ).fill(
                      <View>
                        <Emoji key={intake.id} name="circle" />
                      </View>
                    );

                    return [
                      ...checkmarks,
                      ...missedIcons,
                      ...skippedIcons,
                      ...uncompleted,
                    ].map((item, index) => <View key={index}>{item}</View>);
                  })
                ) : (
                  // If there are no intakes for this day
                  <Emoji name="circle" />
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
      <View className="my-3 gap-y-2">
        {drugs.map((drug) => (
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

export default WeeklyIntakeChart;
