import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const Back = ({ action }: { action?: () => void }) => {
  const { back } = useRouter();

  const handleAction = () => {
    if (action) {
      action();
    } else {
      back();
    }
  };
  return (
    <TouchableOpacity onPress={handleAction}>
      <Feather name="chevron-left" size={30} color={"gray"} />
    </TouchableOpacity>
  );
};

export default Back;
