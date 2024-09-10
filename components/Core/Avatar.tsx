import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

const Avatar = ({
  size,
  name,
}: {
  size: string;
  name: string;
  image?: string;
}) => {
  return (
    <View
      className={clsx([
        "h-14 w-14 rounded-full items-center justify-center",
        size === "xl" && "h-44 w-44",
      ])}
    >
      <Image
        source={require("@/assets/images/avatar.png")}
        className="absolute h-full w-full rounded-full"
      />

      <Text
        className={clsx([
          "font-main text-white font-bold ",
          size === "xl" ? "text-[74pt]" : "text-3xl",
        ])}
      >
        {name.charAt(0)}
      </Text>
    </View>
  );
};

export default Avatar;
