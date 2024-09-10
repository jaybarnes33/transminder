import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";
import { useSignUp } from "@/context/Signup";

const One = () => {
  const [focus, setFocus] = React.useState(false);
  const { details, handleChange } = useSignUp();
  return (
    <View className="py-5 space-y-5">
      <View className="space-y-1">
        <Text className="font-main font-bold text-center text-2xl">
          Add your email
        </Text>
        <Text className="font-main font-semibold text-center text-gray-600">
          Sign up with your email address
        </Text>
      </View>

      <TextInput
        value={details?.email}
        className={clsx([
          "h-12 bg-gray-200 font-main font-semibold px-3 py-1 rounded-xl lowercase",
          focus && " border-2 border-ring ",
        ])}
        placeholder="Email Address"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => handleChange("email", text)}
        onFocus={() => setFocus(true)}
      />
    </View>
  );
};

export default One;
