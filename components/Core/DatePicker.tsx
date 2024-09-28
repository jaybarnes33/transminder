import { View, Text, Platform } from "react-native";
import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const DatePicker = () => {
  const [date, setDate] = useState("");
  const openPicker = () =>
    DateTimePickerAndroid.open({
      display: "default",
    });
  return (
    Platform.OS === "ios" && (
      <View>
        <Text>DatePicker</Text>
      </View>
    )
  );
};

export default DatePicker;
