import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";
import Input from "@/components/Core/Input";

const Name = () => {
  const { details, handleChange } = useSignUp();

  return (
    <View className="py-5 gap-y-5">
      <View>
        <Text className="font-fwbold text-center text-2xl mb-1">
          Enter your name
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          Let's get to know each other!
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          How would you like us to call you?
        </Text>
      </View>

      <Input
        value={details?.name}
        placeholder="Name"
        textContentType="name"
        onChangeText={(text) => handleChange("name", text)}
      />
    </View>
  );
};

export default Name;
