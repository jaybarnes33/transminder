import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";
import { useSignUp } from "@/context/Signup";
import Validation from "../../Validation";

const Password = () => {
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
          Create your password
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          Your password must be at least 8 characters long, and include 1 symbol
          and 1 number.
        </Text>
      </View>

      <TextInput
        className={clsx([
          "h-12 bg-gray-200 font-main text-base  font-bold px-3  justify-center  rounded-xl lowercase",
          focus && " border-2 border-ring",
        ])}
        value={details?.password}
        placeholder="**********"
        autoCapitalize="none"
        textContentType="password"
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
        onFocus={() => setFocus(true)}
      />

      {details?.password?.length && (
        <View className="space-y-2">
          <Validation
            valid={details?.password?.length >= 8}
            text="Minimum 8 characters"
          />
          <Validation
            valid={containsNumber(details?.password)}
            text="At least 1 number"
          />
          <Validation
            valid={containsSymbol(details?.password)}
            text="At least 1 symbol"
          />
        </View>
      )}
    </View>
  );
};

export default Password;
