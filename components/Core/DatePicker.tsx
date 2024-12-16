import { View, Text, Platform, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { DatePicker as Picker } from "@/components/nativewindui/DatePicker";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";

const DatePicker = ({
  label = "Date",
  value,
  isEdit = false,
  handleChange,
  secondary,
}: {
  label: string;
  handleChange: (val: string) => void;
  value: string;
  secondary?: boolean;
  isEdit: boolean;
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isEdit);
  }, [isEdit]);

  return (
    <TouchableOpacity
      onPress={() => {
        setShow((show) => !show);
      }}
      className={clsx([
        "flex-row h-[50] px-3 justify-between flex-1 items-center",
        secondary && "px-0",
      ])}
    >
      <Text
        className={clsx([
          "text-base text-[#333] font-semibold",
          secondary && "text-neutral-400",
        ])}
      >
        {label}
      </Text>
      {!show && (
        <View className="flex-row gap-x-1 items-center">
          <Feather name="calendar" color="#0D96FF" />
          <Text className="text-[#0d96ff] font-semibold text-base">Today</Text>
        </View>
      )}
      {show && (
        <Picker
          mode="date"
          onChange={(event, date) => {
            if (event.type === "set" && !!date) {
              handleChange(date.toISOString());
            }
          }}
          value={new Date(value)}
        />
      )}
    </TouchableOpacity>
  );
};

export default DatePicker;
