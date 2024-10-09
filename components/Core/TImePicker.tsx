import { View, Text } from "react-native";
import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const TimePicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <View className="w-full flex-row justify-between items-center px-3 bg-neutral-200 rounded-xl h-[50px]">
      {!show && (
        <TouchableOpacity onPress={() => setShow(true)}>
          <Text className="font-main text-base">{label}</Text>
        </TouchableOpacity>
      )}
      {show && (
        <RNDateTimePicker
          value={new Date(value)}
          mode="time"
          onChange={(event, date) => {
            if (event.type === "set" && date) {
              onChange(date.toISOString());
            }
          }}
        />
      )}
      <TouchableOpacity onPress={() => setShow((val) => !val)}>
        <Feather name="clock" color={"#0d69ff"} size={16} />
      </TouchableOpacity>
    </View>
  );
};

export default TimePicker;
