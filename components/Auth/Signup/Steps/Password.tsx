import { View, Text } from "react-native";
import React from "react";
import { useSignUp } from "@/context/Signup";
import Validation from "../../Validation";
import { containsNumber, containsSymbol } from "@/utils";
import Input from "@/components/Core/Input";

const Password = () => {
  const { details, handleChange } = useSignUp();

  return (
    <View className="py-5 space-y-5">
      <View className="">
        <Text className="font-fwbold text-center text-2xl mb-1">
          Create your password
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          Your password must be at least 8 characters long, and include 1 symbol
          and 1 number.
        </Text>
      </View>

      <Input
        value={details?.password}
        placeholder="••••••••"
        autoCapitalize="none"
        textContentType="password"
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
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
