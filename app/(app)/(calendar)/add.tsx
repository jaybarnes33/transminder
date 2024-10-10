import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import clsx from "clsx";
import Input from "@/components/Core/Input";

import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import TimePicker from "@/components/Core/TImePicker";
import DatePicker from "@/components/Core/DatePicker";
import FrequencyPicker from "@/components/Core/FrequencyPicker";
import axiosInstance from "@/lib/axios";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import Message from "@/components/Core/Message";
import { mutate } from "swr";

const Wrapper = () => {
  const colors = ["bg-blue-700", "bg-yellow-500", "bg-ring"];

  const categories = ["health_check-ins", "milestones", "community"];

  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    note: string;
    date: string;
    repeats: string;
    start: string;
    end: string;
  }>({
    name: "",
    location: "",
    note: "",
    date: new Date().toISOString(),
    repeats: "daily",
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { navigate } = useRouter();
  const createAppointment = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/events", {
        ...formData,
        start: formData.start,
      });
      mutate("/events");
      navigate("/(app)/(calendar)");
    } catch (error) {
      //@ts-ignore
      setError(error.response.data.message ?? "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, val: string) => {
    setError("");
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleFrequency = (val: string) => {
    handleChange("repeats", val);
  };

  const handleDate = (val: string) => {
    handleChange("date", val);
  };

  const handleStart = (val: string) => {
    handleChange("start", val);
  };
  const handleEnd = (val: string) => {
    handleChange("end", val);
  };
  return (
    <SafeAreaView className="px-4 flex-1 ">
      <View className="absolute w-screen z-0  h-[100vh]">
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="100%" x2="100%" y1="50%" y2="100%">
              <Stop offset="0" stopColor="#d9cae9" />
              <Stop offset="1" stopColor="#ffffff" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-row justify-between items-center">
          <Back />
          <Text className="font-main flex-1 text-center text-base -ml-4">
            Add new event
          </Text>
        </View>
        <View className="my-4">
          <Text className="font-main px-4 text-center text-base">
            Find more in the learn section for tips on organizing your schedule
          </Text>
        </View>
        {error && <Message message={error} isError />}
        <View>
          <Input
            placeholder="Event name*"
            onChangeText={(text) => handleChange("name", text)}
          />
          <Input
            placeholder="Location"
            onChangeText={(text) => handleChange("location", text)}
          />
          <Input
            placeholder="Note"
            multiline
            onChangeText={(text) => handleChange("note", text)}
          />
        </View>
        <View className="my-4 space-y-2">
          <TouchableOpacity className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-neutral-200">
            <Text className="font-main text-base">Date</Text>
            <View className="flex-row space-x-2 items-center">
              <DatePicker value={formData.date} handleChange={handleDate} />
              <Feather name="chevron-right" size={20} color={"gray"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-neutral-200">
            <Text className="font-main text-base">Repeat</Text>
            <View className="flex-row space-x-2 items-center">
              <FrequencyPicker handleChange={handleFrequency} />
            </View>
          </TouchableOpacity>
          <View className="flex-row justify-between space-x-2">
            <View className="w-[48%]">
              <TimePicker
                value={formData.start}
                onChange={handleStart}
                label="Start Time"
              />
            </View>
            <View className="w-[48%]">
              <TimePicker
                value={formData.end}
                label="End Time"
                onChange={handleEnd}
              />
            </View>
          </View>
        </View>
        <View className="space-y-2 mt-auto mb-4">
          <Text className="font-main text0base">
            Select Category (optional tag)
          </Text>
          <View className="flex-row justify-between ">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                className={clsx([
                  "min-w-[30%] p-2 rounded-full items-center",
                  colors[index],
                ])}
              >
                <Text className="text-base font-semibold text-white capitalize">
                  {category.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity
        onPress={createAppointment}
        className="h-[50px] items-center flex-row space-x-2  justify-center bg-ring rounded-full w-full mt-auto"
      >
        <Text className="font-semibold text-white">Create event</Text>

        {loading && <ActivityIndicator color={"white"} />}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Wrapper;
