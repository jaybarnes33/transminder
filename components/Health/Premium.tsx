import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "../Core/Icon";
import Emoji from "../Core/Emoji";
import { useRouter } from "expo-router";

const Premium = () => {
  const { navigate } = useRouter();
  return (
    <View className="m-1 mt-4 mb-14 p-4 h-[305px] shadow-sm bg-white rounded-[20px]">
      <View className="flex-row items-center gap-x-2">
        <Text className="text-lg font-fwbold">Transminder</Text>
        <Image source={require("@/assets/images/premium.png")} />
      </View>
      <View className="mt-5 flex-row items-center flex-1 gap-x-3 ">
        <Icon name="stars-fill" />
        <View className="bg-neutral-100 flex-1 p-3 gap-y-1 rounded-t-3xl rounded-br-3xl">
          <Text className="font-main font-semibold text-sm ">
            Unlock everything, no limits
          </Text>
          <Text className="font-main font-semibold text-sm">
            Get help to make the most of your app
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigate("/premium")}
        className="flex-row items-center justify-center bg-ring mx-auto px-7    h-12 rounded-full mt-4"
      >
        <Text className="font-main font-semibold text-base text-white">
          Let's gooo Premium
        </Text>
      </TouchableOpacity>
      <Text className="text-center font-main text-sm mt-4 text-neutral-500">
        Transminder Premium is not a diagnostic tool
      </Text>
      <TouchableOpacity className="flex-row items-center justify-center mx-auto px-7 rounded-full  mt-4">
        <Emoji name="premium" />
        <Text className="font-main font-semibold text-sm text-yellow-500">
          Unlock 50% off. Limited.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Premium;
