import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";

const Success = () => {
  const { message } = useLocalSearchParams();
  const { navigate } = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white h-full px-4 items-center justify-center gap-y-14">
      <View className="gap-y-1">
        <Text className="font-fwbold  text-center text-xl">Successful</Text>
        <Text className="font-main text-center text-neutral-500 font-semibold">
          {message}
        </Text>
      </View>
      <Image source={require("@/assets/images/mail-success.png")} />
      <TouchableOpacity
        onPress={() => navigate("/Login")}
        className={clsx([
          "bg-dark h-[50] w-full flex-row gap-x-2 mt-4 items-center justify-center rounded-[40px]",
        ])}
      >
        <Text className="font-fwbold text-base text-white">Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Success;
