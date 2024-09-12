import { View, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";

const Message = ({
  message,
  isError,
}: {
  message: string;
  isError?: boolean;
}) => {
  return (
    <View
      className={clsx([
        "items-center p-3  my-3 space-x-2 border flex-row",
        isError ? "bg-red-200 border-red-400" : "bg-green-100 border-green-400",
      ])}
    >
      {isError ? (
        <Feather name="alert-triangle" size={16} color={"#ef4444"} />
      ) : (
        <Feather name="check-circle" color="#22c55e" />
      )}
      <Text
        className={clsx([
          "font-main font-bold text-xs",
          isError ? "text-red-500" : "text-green-500",
        ])}
      >
        {message}
      </Text>
    </View>
  );
};

export default Message;
