import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Wrapper from "@/components/Settings/Wrapper";
import clsx from "clsx";

const paymentPlans = [
  {
    name: "Monthly",
    price: "€9.99",
    description: "Billed monthly. Cancel anytime.",
  },
  {
    name: "Yearly",
    price: "€99.99",
    description: "Billed yearly. Save 17%. Cancel anytime.",
  },
  {
    name: "Six Months",
    price: "€49.99",
    description: "Billed every six months. Save 10%. Cancel anytime.",
  },
  {
    name: "Lifetime",
    price: "€299.99",
    description: "One-time payment. Access forever.",
  },
];

const Change = () => {
  const [selected, setSelected] = useState(paymentPlans[0].name);
  return (
    <Wrapper>
      <View className="pt-3">
        <Text className="font-main text-center font-semibold text-neutral-500">
          Upgrade to Premium to help us stay secure, private, and grow. Not
          ready yet? Enjoy our free features anytime.
        </Text>
      </View>
      <View className="mt-10 space-y-3">
        {paymentPlans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelected(plan.name)}
            className={clsx([
              "flex-row items-center justify-between border rounded-3xl h-[96] px-4  mb-1",
              selected === plan.name && "border-ring border-2",
            ])}
          >
            <View>
              <Text className="text-base capitalize text-neutral-700 font-fwbold font-main">
                {plan.name}
              </Text>
              <Text className="text-base text-neutral-500 font-main">
                {plan.description}
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <Text className="text-base text-dark font-main font-fwbold">
                {plan.price}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mt-auto space-y-3">
        <TouchableOpacity
          onPress={() => {}}
          className="flex-row items-center justify-center bg-purple-500 h-12 rounded-full "
        >
          <Text className="font-main font-semibold text-white">
            Switch Plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          className="flex-row items-center justify-center  h-12 rounded-full "
        >
          <Text className="font-main font-semibold ">Cancel Plan</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default Change;
