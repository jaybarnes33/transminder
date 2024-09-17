import { View, Text, Image } from "react-native";
import React from "react";
import Wrapper from "@/components/Settings/Wrapper";

const Coupon = () => {
  return (
    <Wrapper>
      <View className="items-center h-[30vh] justify-center">
        <Image source={require("@/assets/images/coupon.png")} />
      </View>

      <View className="mt-5 space-y-2 ">
        <Text className="font-main font-fwbold text-center text-base text-neutral-500">
          Have a coupon code?
        </Text>
        <Text className="font-main font-semibold text-center text-sm text-dark">
          Visit our website to redeem it and unlock exclusive discounts or
          features.
        </Text>
        <Text className="font-main font-semibold text-center text-sm text-dark">
          Simply go to{" "}
          <Text className="text-purple-500 font-fwbold">
            www.transminder.app
          </Text>
          , enter your code, and log in. Your access will be updated shortly
          after!
        </Text>
        <Text className="font-main font-semibold text-center text-sm text-dark">
          Make sure to use the same account on the website and the app for the
          coupon to work properly.
        </Text>
      </View>
    </Wrapper>
  );
};

export default Coupon;
