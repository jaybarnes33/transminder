import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";

const Two = () => {
  const [focus, setFocus] = React.useState(false);
  const { details, handleChange } = useSignUp();
  return (
    <View className="py-5 space-y-5">
      <View className="">
        <Text className="font-main font-bold text-center text-2xl mb-1">
          Enter code
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          We sent a verification code to your email
        </Text>
        <Text className="font-main text-center text-base font-semibold">
          {details?.email}
        </Text>
      </View>

      <TextInput
        value={details?.otp}
        className={clsx([
          "h-12 bg-gray-200 font-main text-2xl font-bold px-3 text-center py-1 rounded-xl lowercase",
          focus && " border-2 border-ring",
        ])}
        placeholder="- - - - - -"
        keyboardType="numeric"
        autoCapitalize="none"
        onChangeText={(text) => handleChange("otp", text)}
        onFocus={() => setFocus(true)}
        maxLength={6}
      />
    </View>
  );
};

export default Two;
