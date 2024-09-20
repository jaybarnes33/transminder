import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { ReactNode, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drug, IconName } from "@/types/global";
import Input from "@/components/Core/Input";
import clsx from "clsx";
import Back from "@/components/Core/Back";
import { useRouter } from "expo-router";
import { doses, drugTypes } from "@/constants";
import Icon from "@/components/Core/Icon";
import { Feather, FontAwesome6 } from "@expo/vector-icons";

const Add = () => {
  const [drug, setDrug] = useState<Drug>({
    name: "",
    times: [
      {
        taken: false,
        time: "08:00",
      },
    ],
    dosage: "",
    type: "" as Drug["type"],
    notes: [""],
    unit: "",
  });

  const handleChange = (key: string, value: string) => {
    setDrug((prev) => ({ ...prev, [key]: value }));
  };
  const components: Record<number, ReactNode> = {
    0: (
      <View className="space-y-10">
        <Text className="font-fwbold text-xl text-center capitalize">
          Add medication name
        </Text>
        <View>
          <Input
            name="Medication Name"
            value={drug.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>
      </View>
    ),

    1: (
      <View className="space-y-10">
        <Text className="font-fwbold text-xl text-center">
          Select Medication Type
        </Text>

        <View className="space-y-2">
          {drugTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleChange("type", type)}
              className={clsx([
                "p-2 px-3 flex-row justify-between rounded-xl h-[50] items-center space-x-2 bg-gray-100",
                drug.type === type && "bg-blue-500",
              ])}
            >
              <Icon name={type as IconName} />
              <Text
                className={clsx([
                  "capitalize flex-1 font-semibold text-base",
                  drug.type === type && "text-white",
                ])}
              >
                {type}
              </Text>
              {drug.type === type && (
                <Feather name="check" color="white" size={18} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),

    2: (
      <View className="space-y-10">
        <Text className="font-fwbold text-xl text-center">
          Add medication dosage
        </Text>
        <View>
          <Input
            name="Strength"
            value={drug.dosage}
            onChangeText={(text) => handleChange("dosage", text)}
          />
        </View>
        <View className="space-y-1">
          <Text className="font-semibold text-gray-600">Choose unit</Text>
          <View className="space-y-1">
            {doses.map((unit) => (
              <TouchableOpacity
                key={unit}
                onPress={() =>
                  handleChange("unit", unit !== drug.unit ? unit : "")
                }
                className={clsx([
                  "p-2 px-3 rounded-xl h-[50] flex-row items-center bg-gray-100",
                  drug.unit === unit && "bg-blue-500",
                ])}
              >
                <Text
                  className={clsx([
                    "capitalize flex-1 font-semibold text-base",

                    drug.unit === unit ? "text-white" : "text-dark",
                  ])}
                >
                  {unit}
                </Text>

                {drug.unit === unit && (
                  <Feather name="check" color="white" size={18} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    ),
    3: (
      <View className="space-y-10">
        <Text className="font-fwbold text-xl text-center">Add a reminder</Text>

        <View className="space-y-5">
          <View className="space-y-2">
            <Text>Frequency</Text>
            <TouchableOpacity className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-gray-100">
              <Text className="font-semibold text-base">Start Date</Text>
              <View className="flex-row space-x-2 items-center">
                <Feather name="calendar" color="#0D96FF" />
                <Text className="text-blue-600 font-semibold text-base">
                  Today
                </Text>
                <Feather name="chevron-right" size={20} color={"gray"} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-gray-100">
              <Text className="font-semibold text-base">Repeat</Text>
              <View className="flex-row space-x-2 items-center">
                <FontAwesome6 name="repeat" color="#0D96FF" />
                <Text className="text-blue-600 font-semibold text-base">
                  Everyday
                </Text>
                <Feather name="chevron-right" size={20} color={"gray"} />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <Text>Time</Text>
            <TouchableOpacity>
              <Text>Start Date</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Repeat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    4: (
      <View className="space-y-10">
        <Text className="font-fwbold text-xl text-center">Add a reminder</Text>

        <View>
          <Text>Frequency</Text>
          <TouchableOpacity>
            <Text>Start Date</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Repeat</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>Time</Text>
          <TouchableOpacity>
            <Text>Start Date</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Repeat</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
  };

  const { navigate } = useRouter();
  const [step, setStep] = useState(0);

  const validations: Record<number, boolean> = {
    0: !!drug.name,
    1: !!drug.type,
    2: !!drug.dosage,
    3: !!drug.times,
    4: !!drug.notes,
  };

  const handleNext = () => {
    if (step === 4) {
      return;
    }
    setStep((step: number) => step + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      navigate("/(app)/(medications)");
    }
    setStep((step: number) => step - 1);
  };

  return (
    <SafeAreaView className="px-4 flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="space-y-2 my-2">
          <View className="flex-row justify-between items-center mb-2">
            <Back action={handleBack} />
            <View>
              <Text className="font-main text-base text-center  font-semibold">
                {drug.name ?? " Add Medication"}
              </Text>
              <Text className="text-gray-500 capitalize text-sm text-center">
                {drug.type}
              </Text>
            </View>

            <TouchableOpacity onPress={() => navigate("/(app)/(medications)")}>
              <Text className="text-gray-500 text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
          <View
            className={clsx([
              "w-screen -left-4 px-4 mt-5 flex-row space-x-1  justify-between",
            ])}
          >
            {Object.keys(components).map((_, index) => (
              <View
                key={index}
                className={clsx([
                  "flex-1 h-1 rounded-full ",
                  index <= step ? "bg-blue-500" : "bg-gray-100",
                ])}
              />
            ))}
          </View>
        </View>
        <View className="mt-4">{components[step]}</View>

        <View className="bg-white mt-auto">
          <TouchableOpacity
            disabled={!validations[step]}
            onPress={handleNext}
            className={clsx([
              "h-[50] mb-5 bg-dark items-center justify-center rounded-[30px]",
              !validations[step] && "bg-gray-500",
            ])}
          >
            <Text className="font-semibold text-white text-base">Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Add;
