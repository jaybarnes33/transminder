import { View, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Back from "@/components/Core/Back";
import { useSignUp } from "@/context/Signup";
import clsx from "clsx";
import Message from "@/components/Core/Message";

const Header = () => {
  const { step, back, error, message } = useSignUp();

  const isError = !!error;
  return (
    <View className=" w-full">
      <View className="flex-row items-center">
        <Back action={step > 1 ? back : undefined} />

        <Text className="flex-1 text-base font-main font-semibold text-center mr-5">
          Step {step} of 8
        </Text>
      </View>
      {(error || message) && (
        <Message message={isError ? error : message} isError={isError} />
      )}

      <View
        className={clsx([
          "w-screen -left-4 px-4 mt-5 flex-row  justify-between",
          error.length && "mt-0",
        ])}
      >
        {new Array(8).fill(0).map((_, index) => (
          <View
            key={index}
            className={clsx([
              "w-[11%] h-1 rounded-full ",
              index + 1 <= step ? "bg-purple-500" : "bg-gray-200",
            ])}
          />
        ))}
      </View>
    </View>
  );
};

export default Header;
