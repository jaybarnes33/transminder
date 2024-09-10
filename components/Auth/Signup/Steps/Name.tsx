import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";

const Name = () => {
  const [focus, setFocus] = React.useState(false);
  const { details, handleChange } = useSignUp();

  const containsSymbol = (password: string) => {
    return /[^a-zA-Z0-9]/.test(password);
  };

  const containsNumber = (password: string) => {
    return /[0-9]/.test(password);
  };
  return (
    <View className="py-5 space-y-5">
      <View className="">
        <Text className="font-main font-bold text-center text-2xl mb-1">
          Enter your name
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          Let's get to know each other!
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          How would you like us to call you?
        </Text>
      </View>

      <TextInput
        className={clsx([
          "h-12 bg-gray-200 font-main text-base items-center font-bold px-3 justify-cener pb-2  rounded-xl lowercase",
          focus && " border-2 border-ring",
        ])}
        value={details?.name}
        placeholder="Name"
        autoCapitalize="none"
        textContentType="name"
        onChangeText={(text) => handleChange("name", text)}
        onFocus={() => setFocus(true)}
      />
    </View>
  );
};

export default Name;
