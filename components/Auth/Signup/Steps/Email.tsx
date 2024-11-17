import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import { useSignUp } from "@/context/Signup";
import Input from "@/components/Core/Input";

const One = () => {
  const { details, handleChange } = useSignUp();
  return (
    <View className="py-5 gap-y-5">
      <View className="gap-y-1">
        <Text className=" font-fwbold text-center text-2xl">
          Add your email
        </Text>
        <Text className="font-main font-semibold text-center text-gray-600">
          Sign up with your email address
        </Text>
      </View>
      <Input
        value={details?.email}
        placeholder="Email Address"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => handleChange("email", text)}
      />
    </View>
  );
};

export default One;
