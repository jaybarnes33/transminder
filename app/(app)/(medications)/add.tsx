import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drug, DrugPayload, IconName } from "@/types/global";
import * as Notification from "expo-notifications";
import Input from "@/components/Core/Input";
import clsx from "clsx";
import Back from "@/components/Core/Back";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doses, drugTypes } from "@/constants";
import Icon from "@/components/Core/Icon";
import { Feather, FontAwesome6, Octicons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import axiosInstance from "@/lib/axios";
import Message from "@/components/Core/Message";
import useSWR, { mutate } from "swr";
import DatePicker from "@/components/Core/DatePicker";
import FrequencyPicker from "@/components/Core/FrequencyPicker";

const Add = () => {
  const [drug, setDrug] = useState<DrugPayload>({
    name: "",
    times: [new Date().toTimeString().split(" ")[0]],
    start: new Date().toISOString(),
    repeat: "daily",
    dosage: "",
    type: "" as Drug["type"],
    notes: "",
    unit: "",
  });

  const { id } = useLocalSearchParams();

  const [error, setError] = useState("");
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);

  const isEdit = !!id;
  const [show, setShow] = useState(false);
  const [activeReminderIndex, setActiveReminderIndex] = useState<number | null>(
    null
  );

  const getSchedule = () => {
    const day = new Date(drug.start);

    return {
      repeat: drug.repeat,
      day: day.getDay(),
      date: day.getDate(),
    };
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    index: number
  ) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;

      setDrug((prev) => ({
        ...prev,
        times: prev.times.map((t, i) =>
          i === index ? currentDate.toTimeString().split(" ")[0] : t
        ),
      }));
    }
    setShow(false);
    setActiveReminderIndex(null);
  };

  const validations: Record<number, boolean> = {
    0: !!drug.name,
    1: !!drug.type,
    2: !!drug.dosage,
    3: !!drug.times,
    4: true,
  };

  const handleNext = async () => {
    if (step === 4) {
      await addDrug();
      return;
    }
    setStep((step: number) => step + 1);
  };

  const handleBack = () => {
    if (step < 1) {
      navigate("/(app)/(medications)");
      return;
    }
    setStep((step: number) => step - 1);
  };

  const handleChange = (key: string, value: string | {}) => {
    setDrug((prev) => ({ ...prev, [key]: value }));
  };

  const handleStart = (val: string) => {
    handleChange("start", val);
  };

  const handleFreq = (val: string) => {
    handleChange("repeat", val);
  };

  const [name, setName] = useState("");

  const fetchDrug = async () => {
    const { data } = await axiosInstance.get(`/drugs/${id}`);
    return data;
  };

  const {
    data,
    isLoading,
    error: fetchError,
  } = useSWR(`/drug/${id}`, fetchDrug);
  useEffect(() => {
    if (isEdit && data?.name) {
      setDrug(data);
      setName(data.name);
    }
    if (isEdit && !isLoading && fetchError) {
      setError("Failed to load data");
    }
  }, [isEdit, data, fetchError]);
  const addDrug = async () => {
    try {
      console.log({ isEdit });
      !isEdit
        ? await axiosInstance.post("/drugs", {
            ...drug,
            schedule: getSchedule(),
          })
        : await axiosInstance.put(`/drugs/${id}`, {
            ...drug,
            schedule: getSchedule(),
          });

      mutate("/medications");
      mutate("/intake/generate");
      mutate("/medications?size");
      navigate("/(medications)");
    } catch (error) {
      console.error(error);
      //@ts-ignore
      setError(error.response.data.error ?? error.message);
    }
  };

  const components: Record<number, ReactNode> = {
    0: (
      <View className="space-y-10">
        <Text className="font-fwbold text-xl text-center capitalize">
          {isEdit ? `Edit ${name}` : "Add medication name"}
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
                "p-2 px-3 flex-row justify-between rounded-xl h-[50] items-center space-x-2 bg-gray-200",
                drug.type === type && "bg-blue-500",
              ])}
            >
              <Icon
                name={
                  (drug.type === type ? `${type}-active` : type) as IconName
                }
              />
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
                  "p-2 px-3 rounded-xl h-[50] flex-row items-center bg-gray-200",
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
            <Text className="font-main font-semibold">Frequency</Text>
            <TouchableOpacity className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-gray-200">
              <Text className="font-semibold text-base">Start Date</Text>
              <View className="flex-row space-x-2 items-center">
                <DatePicker value={drug.start} handleChange={handleStart} />
                <Feather name="chevron-right" size={20} color={"gray"} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="h-[50]  rounded-lg flex-row px-3 items-center justify-between bg-gray-200">
              <Text className="font-semibold text-base">Repeat</Text>
              <View className="flex-row space-x-2 items-center">
                <FrequencyPicker handleChange={handleFreq} />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="font-main font-semibold">Time</Text>
            <ScrollView className="space-y-2">
              {drug.times.map((time, index) => (
                <View
                  className="flex-row h-50 bg-gray-200 py-3 px-3 rounded-xl justify-between my-3 items-center"
                  key={index}
                >
                  {show && activeReminderIndex === index && (
                    <RNDateTimePicker
                      value={new Date()}
                      mode="time"
                      onChange={(event, selectedDate) =>
                        handleDateChange(event, selectedDate, index)
                      }
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      setShow(true);
                      setActiveReminderIndex(index);
                    }}
                  >
                    <Text className="text-base">{time}</Text>
                  </TouchableOpacity>
                  {drug.times.length > 0 && (
                    <TouchableOpacity
                      onPress={() =>
                        setDrug((prev) => ({
                          ...prev,
                          times: prev.times.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Octicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {drug.times.length > 0 && drug.times.length <= 6 && (
                <TouchableOpacity
                  onPress={() =>
                    handleChange("times", [
                      ...drug.times,
                      new Date().toTimeString().split(" ")[0],
                    ])
                  }
                  className="bg-blue-100 my-2 rounded-lg py-3 px-3 flex-row space-x-3 items-center"
                >
                  <Feather name="plus" color="#0d96ff" size={18} />
                  <Text className="font-semibold text-[#0d96ff]">Add Time</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    ),
    4: (
      <View className="space-y-10 items-center">
        <View className="items-center space-y-3">
          <View className="h-12 w-12 bg-blue-100 items-center justify-center rounded-full">
            <Icon name={`${drug.type}-active` as IconName} />
          </View>
          <Text className="font-fwbold text-xl text-center">{drug.name}</Text>
        </View>
        <View className="h-[110px] space-y-3 w-full p-4 bg-white rounded-[20px]  shadow ">
          <View className="flex-row  justify-between items-center pb-2 border-b border-neutral-300 ">
            <Text className="text-neutral-500 font-semibold text-base">
              Schedule
            </Text>
            <Text className="text-dark font-semibold text-base">Everyday</Text>
          </View>
          <View className="flex-row  justify-between items-center   ">
            <Text className="text-neutral-500 font-semibold text-base">
              {drug.times.length} time(s)
            </Text>
            <Text className="text-dark font-semibold text-base">
              {drug.dosage} {drug.unit}
            </Text>
          </View>
        </View>
        <View className="w-full space-y-2">
          <Text className="font-main font-semibold">Notes</Text>
          <TextInput
            className="bg-neutral-100 h-[100px] p-3 rounded-lg"
            value={drug.notes}
            onChangeText={(text) => handleChange("notes", text)}
            multiline
            numberOfLines={10}
          />
        </View>
      </View>
    ),
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
                {step === 0
                  ? !isEdit
                    ? " Add Medication"
                    : `Update ${name}`
                  : drug.name}
              </Text>
              {step > 1 && (
                <Text className="text-gray-500 capitalize text-sm text-center">
                  {drug.type} {step > 2 && `${drug.dosage} ${drug.unit}`}
                </Text>
              )}
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
                  index <= step ? "bg-blue-500" : "bg-gray-200",
                ])}
              />
            ))}
          </View>
        </View>
        {error && <Message message={error} isError />}
        <View className="mt-4">{components[step]}</View>

        <View className="bg-white mt-auto">
          <TouchableOpacity
            disabled={!validations[step]}
            onPress={handleNext}
            className={clsx([
              "h-[50] mb-5 bg-dark items-center justify-center rounded-[30px]",
              !validations[step] && "bg-gray-500",
              step == 4 && "bg-blue-500",
            ])}
          >
            <Text className="font-semibold text-white text-base">
              {step !== 4 ? "Next" : "Done"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Add;
