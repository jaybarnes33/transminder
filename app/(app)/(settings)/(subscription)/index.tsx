import { View, Text, Touchable } from "react-native";
import React from "react";
import Wrapper from "@/components/Settings/Wrapper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import clsx from "clsx";

const Subscription = () => {
  const items = [
    {
      icon: "gift",
      text: "I have a code",
      path: "/coupon", // Replace with your actual screen name
    },
    {
      icon: "refresh-ccw",
      text: "Renew Subscription",
      path: "/renew", // Replace with your actual screen name
    },
  ];

  const { navigate } = useRouter();

  return (
    <Wrapper>
      <View className="mt-4 space-y-3 ">
        <View className="space-y-2">
          <Text className="font-main text-base font-semibold text-neutral-500">
            Current Plan
          </Text>
          <View className="items-center border rounded-[30px] space-y-2 justify-center h-[116]">
            <Text className="text-xl text-dark font-semibold font-main">
              Free Plan
            </Text>
            <TouchableOpacity onPress={() => navigate("/change")}>
              <Text className="text-xs text-purple-500 font-fwbold font-main">
                Change Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="mt-10 space-y-5 flex-1">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigate(item.path as Href)}
            className={clsx([
              "flex-row space-x-3 items-center justify-between px-4 rounded-xl mb-1 ",
              index === items.length - 1 && "border-t pt-5",
            ])}
          >
            <Feather name={item.icon as "gift" | "refresh-ccw"} size={30} />
            <Text className="text-base capitalize flex-1 text-neutral-700 font-fwbold font-main">
              {item.text}
            </Text>
            <Feather name="chevron-right" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
    </Wrapper>
  );
};

export default Subscription;
