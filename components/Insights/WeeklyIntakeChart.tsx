import { View, Text, Image } from "react-native";
import React, { useMemo } from "react";
import { Ionicons, Octicons } from "@expo/vector-icons";
import clsx from "clsx";
import { getDaysOfWeek } from "@/utils";
import { IntakeAnalytics } from "./Intake";
import Emoji from "../Core/Emoji";

const generateBlueShades = (count: number) => {
  // Generate an array of blue shades with different luminosity and saturation
  const shades = [];
  for (let i = 0; i < count; i++) {
    const hue = 210; // Blue hue
    const saturation = 80 + ((i * 5) % 20); // Vary saturation between 80-100
    const luminosity = 65 - ((i * 7) % 30); // Vary luminosity to create distinct shades
    shades.push(`hsl(${hue}, ${saturation}%, ${luminosity}%)`);
  }
  return shades;
};

const WeeklyIntakeChart = ({
  intakes,
  drugs,
}: {
  intakes: IntakeAnalytics["intakes"];
  drugs: IntakeAnalytics["drugs"];
}) => {
  // Create a map of drug IDs to colors
  const drugColors = useMemo(() => {
    const blueShades = generateBlueShades(drugs.length);
    return drugs.reduce((acc, drug, index) => {
      // Convert HSL to tailwind-compatible class and store both HSL and class
      acc[drug.id] = {
        hsl: blueShades[index],
        class: `text-[${blueShades[index]}]`,
        bgClass: `bg-[${blueShades[index]}]`,
      };
      return acc;
    }, {} as { [key: string]: { hsl: string; class: string; bgClass: string } });
  }, [drugs]);

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
          return (
            <View
              key={item.date}
              className="items-center gap-y-2 flex-grow justify-end"
            >
              <View className="justify-center items-end gap-y-2">
                {dayIntakes.length > 0 ? (
                  dayIntakes.map((intake) => {
                    const drugColor = drugColors[intake.id]?.hsl || "#60A5FA";

                    // Create an array with 'taken', 'missed', and 'skipped' representations
                    const checkmarks = Array(intake.taken).fill(
                      <Text
                        style={{ color: drugColor }}
                        key={`taken-${intake.id}`}
                      >
                        <Octicons name="check-circle-fill" size={24} />
                      </Text>
                    );

                    const missedIcons = Array(intake.missed).fill(
                      <Emoji name="circle-dashed" key={`missed-${intake.id}`} />
                    );

                    const skippedIcons = Array(intake.skipped).fill(
                      <Ionicons
                        name="close-circle-sharp"
                        size={24}
                        color="gray"
                        key={`skipped-${intake.id}`}
                      />
                    );

                    const uncompleted = Array(
                      intake.total -
                        intake.taken -
                        intake.missed -
                        intake.skipped
                    ).fill(
                      <View key={`uncompleted-${intake.id}`}>
                        <Emoji name="circle" />
                      </View>
                    );

                    return [
                      ...checkmarks,
                      ...missedIcons,
                      ...skippedIcons,
                      ...uncompleted,
                    ].map((item, index) => (
                      <View key={`${intake.id}-${index}`}>{item}</View>
                    ));
                  })
                ) : (
                  <Emoji name="circle" />
                )}
              </View>

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
      <View className="my-3 pt-3 gap-y-3">
        {drugs.map((drug) => (
          <View key={drug.id} className="flex-row justify-between items-center">
            <View className="flex-row  gap-x-2">
              <View
                className="mt-3"
                style={{
                  backgroundColor: drugColors[drug.id]?.hsl || "#60A5FA",
                  width: 5,
                  height: 5,
                  borderRadius: 4,
                }}
              />
              <View>
                <Text className="font-semibold text-sm">{drug.name}</Text>
                <Text className="font-semibold text-xs text-neutral-400 capitalize">
                  {drug.type}
                </Text>
              </View>
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
