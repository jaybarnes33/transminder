import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Keyboard,
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
import KeyboardAvoidingScrollView from "@/components/Core/AvoidKeyboard";
import { DatePicker as Picker } from "@/components/nativewindui/DatePicker";
const Add = () => {
  const [drug, setDrug] = useState<DrugPayload>({
    name: "",
    times: [new Date().toISOString()],
    start: new Date().toISOString(),
    repeat: "everyday",
    repeatFrequency: 0,
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
      frequency: drug.repeatFrequency,
    };
  };

  const handleDateChange = (selectedDate: Date | undefined, index: number) => {
    if (selectedDate) {
      const currentDate = selectedDate;

      setDrug((prev) => ({
        ...prev,
        times: prev.times.map((t, i) =>
          i === index ? currentDate.toISOString() : t
        ),
      }));
    }
    setActiveReminderIndex(null);
  };

  const validations: Record<number, boolean> = {
    0: !!drug.name,
    1: !!drug.type,
    2: true,
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

  const handleFreq = ({
    value,
    frequency,
  }: {
    value: string;
    frequency?: number;
  }) => {
    console.log(frequency);
    handleChange("repeat", value);
    frequency && handleChange("repeatFrequency", frequency);
  };

  const [name, setName] = useState("");

  const fetchDrug = async () => {
    if (!id) return;
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
      !isEdit
        ? await axiosInstance.post("/drugs", {
            ...drug,
            times: drug.times.map((time) =>
              new Date(time).toTimeString().slice(0, 5)
            ),
            schedule: getSchedule(),
          })
        : await axiosInstance.put(`/drugs/${id}`, {
            ...drug,
            times: drug.times.map((time) =>
              new Date(time).toTimeString().slice(0, 5)
            ),
            schedule: getSchedule(),
          });

      mutate("/medications");
      mutate("/intake/generate");

      navigate("/(medications)");
    } catch (error) {
      console.error(error);
      //@ts-ignore
      setError(error.response.data.error ?? error.message);
    }
  };

  const components: Record<number, ReactNode> = {
    0: (
      <View className="gap-y-10">
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
      <View className="gap-y-10">
        <Text className="font-fwbold text-xl text-center">
          Select Medication Type
        </Text>

        <View className="gap-y-2">
          {drugTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleChange("type", type)}
              className={clsx([
                "p-2 px-3 flex-row justify-between rounded-xl h-[50] items-center gap-x-2 ",
                drug.type === type ? "bg-blue-500" : "bg-gray-200",
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
      <View className="gap-y-10">
        <Text className="font-fwbold text-xl text-center">
          Add medication dosage
        </Text>
        <View>
          <Input
            name="Strength"
            value={drug.dosage}
            keyboardType="numeric"
            onChangeText={(text) => handleChange("dosage", text)}
          />
        </View>
        <View className="gap-y-1">
          <Text className="font-semibold text-gray-600">Choose unit</Text>
          <View className="gap-y-1">
            {doses.map((unit) => (
              <TouchableOpacity
                key={unit}
                onPress={() =>
                  handleChange("unit", unit !== drug.unit ? unit : "")
                }
                className={clsx([
                  "p-2 px-3 rounded-xl h-[50] flex-row items-center ",
                  drug.unit === unit ? "bg-blue-500" : "bg-gray-200",
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
      <View className="gap-y-10">
        <Text className="font-fwbold text-xl text-center">Add a reminder</Text>

        <View className="gap-y-5">
          <View className="gap-y-2">
            <Text className="font-main font-semibold">Frequency</Text>
            <TouchableOpacity className="rounded-lg flex-row items-center justify-between bg-gray-200">
              <View className="flex-row gap-x-2 items-center">
                <DatePicker
                  label="Start Date"
                  isEdit={isEdit}
                  value={drug.start}
                  handleChange={handleStart}
                />
                <Feather name="chevron-right" size={20} color={"gray"} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-gray-200">
              <FrequencyPicker handleChange={handleFreq} />
            </TouchableOpacity>
            {drug.repeatFrequency! > 1 &&
              (drug.repeat === "weekly" || drug.repeat === "monthly") && (
                <Text className="font-semibold text-sm">
                  Repeat every {drug.repeatFrequency}{" "}
                  {drug.repeat.replace("ly", "s")}{" "}
                </Text>
              )}
          </View>

          <View>
            <Text className="font-main font-semibold">Time</Text>
            <ScrollView
              onScrollBeginDrag={Keyboard.dismiss}
              className="gap-y-2"
            >
              {drug.times.map((time, index) => {
                return (
                  <View
                    className="flex-row h-50 bg-gray-200 py-3 px-3 rounded-xl justify-between my-3 items-center"
                    key={index}
                  >
                    <Picker
                      mode="time"
                      value={time ? new Date(time) : new Date()}
                      onChange={(event, date) => {
                        if (event.type === "set" && date) {
                          handleDateChange(date, index);
                        }
                      }}
                    />
                    {drug.times.length > 1 && (
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
                );
              })}
              {drug.times.length > 0 && drug.times.length <= 6 && (
                <TouchableOpacity
                  onPress={() =>
                    handleChange("times", [...drug.times, new Date()])
                  }
                  className="bg-blue-100 my-2 rounded-lg py-3 px-3 flex-row gap-x-3 items-center"
                >
                  <Feather name="plus" color="#0d96ff" size={18} />
                  <Text className="font-semibold text-[#0d96ff]">Add Time</Text>
                </TouchableOpacity>
              )}
              <Text className="font-semibold -top-2 text-neutral-400 text-sm">
                A reminder will be sent by Transminder.
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    ),
    4: (
      <Pressable className="gap-y-10 items-center">
        <View className="items-center gap-y-3">
          <View className="h-12 w-12 bg-blue-500 items-center justify-center rounded-full">
            <Icon name={`${drug.type}-active` as IconName} />
          </View>
          <Text className="font-fwbold text-xl text-center">{drug.name}</Text>
        </View>
        <View className="h-[110px] gap-y-3 w-full p-4 bg-white rounded-[20px]  shadow ">
          <View className="flex-row  justify-between items-center pb-2 border-b border-neutral-300 ">
            <Text className="text-neutral-500 font-semibold text-base">
              Schedule
            </Text>
            <Text className="text-dark font-semibold text-base capitalize">
              {drug.repeat}
            </Text>
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
        <View className="w-full gap-y-2 mb-3">
          <Text className="font-main font-semibold">Notes</Text>
          <TextInput
            className="bg-neutral-100 h-[100px] p-3 rounded-lg"
            value={drug.notes}
            placeholder="Add notes..."
            onChangeText={(text) => handleChange("notes", text)}
            multiline
            numberOfLines={10}
          />
        </View>
      </Pressable>
    ),
  };

  return (
    <KeyboardAvoidingScrollView className=" flex-1 bg-white">
      <View className="gap-y-2 my-2">
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
            <Text className="text-gray-500 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <View
          className={clsx([
            "w-screen -left-4 px-4 mt-5 flex-row gap-x-1  justify-between",
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
    </KeyboardAvoidingScrollView>
  );
};

export default Add;
