import { View, Text } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import clsx from "clsx";

const Validation = ({ valid, text }: { valid: boolean; text: string }) => {
  return (
    <View className="flex-row gap-x-3 items-center ">
      {valid ? (
        <AntDesign name="checkcircle" color={"#3b82f6"} />
      ) : (
        <AntDesign name="closecircle" color={"#ef4444"} />
      )}
      <Text
        className={clsx([
          "font-main text-center text-base font-semibold ",
          valid ? "text-blue-500" : "text-red-500",
        ])}
      >
        {text}
      </Text>
    </View>
  );
};

export default Validation;
