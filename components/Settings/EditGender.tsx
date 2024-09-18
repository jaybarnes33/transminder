import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";
import { genders } from "@/constants";
import { useBottomSheetModal } from "@/context/BottomSheet";

import EditItem from "./EditItem";

import { useUser } from "@/context/Auth";

const Item = ({
  gender,
  active,
  onChange,
}: {
  gender: string;
  active: boolean;
  onChange: () => void;
}) => {
  const { setItem } = useBottomSheetModal();

  const { user } = useUser();
  const handleAction = () => {
    if (gender.includes("Other")) {
      setItem(
        <EditItem
          name="gender"
          title="Edit Gender Identity"
          val={user?.genderIdentity as string}
        />
      );
    } else {
      onChange();
    }
  };
  return (
    <TouchableOpacity
      onPress={handleAction}
      className={clsx([
        "h-12  font-main font-semibold px-3 py-1 rounded-xl lowercase my-1 justify-center",
        ,
        active ? "bg-ring text-white" : "bg-gray-200",
      ])}
    >
      <Text
        className={clsx([
          "font-main font-semibold",
          active ? "text-white" : "text-dark",
        ])}
      >
        {gender}
      </Text>
    </TouchableOpacity>
  );
};

const EditGender = ({
  action,
  currentGender,
}: {
  action: (gender: string) => void;
  currentGender: string;
}) => {
  return (
    <View className="flex space-y-3 h-[60vh] ">
      {Array.from(new Set([currentGender, ...genders])).map((item) => (
        <Item
          key={item}
          gender={item}
          active={currentGender === item}
          onChange={() => action(item)}
        />
      ))}
    </View>
  );
};

export default EditGender;
