import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";
import { genders } from "@/constants";

const Item = ({
  gender,
  active,
  onChange,
}: {
  gender: string;
  active: boolean;
  onChange: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onChange}
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

const Gender = () => {
  const {
    details: { genderIdentity: gender },
    handleChange,
  } = useSignUp();

  React.useEffect(() => {
    if (!gender) {
      handleChange("genderIdentity", "Transgender");
    }
  }, []);

  const list = Array.from(new Set([gender, ...genders]));
  return (
    <View className="py-5 space-y-5">
      <View className="space-y-1">
        <Text className="font-main font-fwbold text-center text-2xl">
          How do you identify?
        </Text>
        <Text className="font-main font-semibold text-center text-gray-600">
          Tell us more about yourself
        </Text>
      </View>
      <View className="flex space-y-3 h-[50vh]">
        {list.map((item) => (
          <Item
            key={item}
            gender={item}
            active={gender === item}
            onChange={() => handleChange("genderIdentity", item)}
          />
        ))}
      </View>
    </View>
  );
};

export default Gender;
