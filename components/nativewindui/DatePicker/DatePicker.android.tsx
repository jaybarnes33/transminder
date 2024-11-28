import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import clsx from "clsx";
import * as React from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/nativewindui/Text";

export function DatePicker(
  props: React.ComponentProps<typeof DateTimePicker> & {
    mode: "date" | "time" | "datetime";
  } & {
    materialDateClassName?: string;
    materialDateLabel?: string;
    materialDateLabelClassName?: string;
    materialTimeClassName?: string;
    materialTimeLabel?: string;
    materialTimeLabelClassName?: string;
  }
) {
  const show = (currentMode: "time" | "date") => () => {
    DateTimePickerAndroid.open({
      value: props.value,
      onChange: props.onChange,
      mode: currentMode,
      minimumDate: props.minimumDate,
      maximumDate: props.maximumDate,
    });
  };

  return (
    <View className="flex-row h-full gap-2.5">
      {props.mode.includes("date") && (
        <View className={clsx("relative pt-1.5", props.materialDateClassName)}>
          <Pressable
            onPress={show("date")}
            className=" rounded border py-3 pl-2.5 "
          >
            <Text className="py-px font-main text-base">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(props.value)}
            </Text>
          </Pressable>
          <View
            className={clsx(
              "bg-card absolute left-2 top-0 px-1",
              props.materialDateLabelClassName
            )}
          >
            <Text variant="caption2" className="text-[10px] opacity-60">
              {props.materialDateLabel ?? "Date"}
            </Text>
          </View>
        </View>
      )}
      {props.mode.includes("time") && (
        <Pressable
          onPress={show("time")}
          className="h-full justify-center rounded w-5/6  pl-2.5"
        >
          <Text className="font-semibold text-base">
            {new Intl.DateTimeFormat("en-US", {
              timeStyle: "short",
            }).format(props.value)}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
