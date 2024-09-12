import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import clsx from "clsx";

const Icon = ({ name }: { name: keyof typeof icons }) => {
  return <Image source={icons[name]} />;
};

export default Icon;
