import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DatePicker } from "../nativewindui/DatePicker";

const TimePicker = ({
  label,
  value,
  onChange,
  isEdit = false,
}: {
  label?: string;
  value: string;
  isEdit?: boolean;
  onChange: (val: string) => void;
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isEdit);
  }, [isEdit]);

  const [val, setVal] = useState(value);

  useEffect(() => {
    onChange(val);
  }, [val]);
  return (
    <View className="space-y-1">
      {isEdit && <Text className="font-semibold">{label}</Text>}
      <View className="w-full flex-row justify-between items-center px-3 bg-neutral-200 rounded-xl h-[50px]">
        {!show && (
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text className="font-main text-base">{label}</Text>
          </TouchableOpacity>
        )}
        {show && (
          <DatePicker
            value={new Date(value)}
            mode="time"
            onChange={(event, date) => {
              if (event.type === "set" && date) {
                setVal(date.toISOString());
              }
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShow((val) => !val)}>
          <Feather name="clock" color={"#0d69ff"} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimePicker;
