import { View, Text, Platform, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";

const DatePicker = ({
  value,
  handleChange,
}: {
  handleChange: (val: string) => void;
  value: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <View className="flex-row items-center">
      {!show && (
        <TouchableOpacity
          onPress={() => setShow(true)}
          className="flex-row space-x-1 items-center"
        >
          <Feather name="calendar" color="#0D96FF" />
          <Text className="text-[#0d96ff] font-semibold text-base">Today</Text>
        </TouchableOpacity>
      )}
      {show && (
        <RNDateTimePicker
          onChange={(event, date) => {
            if (event.type === "set" && !!date) {
              handleChange(date.toISOString());
            }
          }}
          value={new Date(value)}
        />
      )}
    </View>
  );
};

export default DatePicker;
