import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import Emoji from "../Core/Emoji";

export const colors = {
  terrible: "bg-[#f87171]",
  awesome: "bg-[#46C17E]",
  bad: "bg-[#FD8C6C]",
  okay: "bg-[#F7CD1B]",
  good: "bg-[#AFEBC4]",
};

const Feeling = ({
  item,
  onPress,
  isActive,
  type,
}: {
  item: string;
  type: string;
  onPress: (type: string, value: string) => void;
  isActive: boolean;
}) => {
  console.log({ type });
  return (
    <TouchableOpacity
      className={clsx([
        "items-center gap-y-1  rounded-full",
        type === "feeling" && "w-1/4",
      ])}
      key={item}
      onPress={() => onPress(type, item)}
    >
      <View
        className={clsx([
          "w-14 h-14 rounded-full items-center justify-center",
          isActive && "border-2 border-ring",
        ])}
      >
        <View
          className={clsx([
            "w-11 h-11 relative  items-center justify-center rounded-full ",
            type === "feeling" && isActive && "bg-blue-100",
            type === "mood"
              ? colors[item as keyof typeof colors]
              : "bg-gray-100",
          ])}
        >
          <Emoji name={item} active={isActive} />
        </View>
        {isActive && (
          <View className="w-6 p-1 h-6 absolute bg-white rounded-full -bottom-1 -right-1">
            <View className="w-full h-full bg-ring items-center justify-center rounded-full">
              <Feather name="check" color={"white"} />
            </View>
          </View>
        )}
      </View>
      <Text
        className={clsx([
          "font-main text-base capitalize text-center",
          type === "feeling" && "text-sm",
        ])}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default Feeling;
