import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import Back from "@/components/Core/Back";
import clsx from "clsx";
import Input from "@/components/Core/Input";

import { Feather } from "@expo/vector-icons";
import TimePicker from "@/components/Core/TImePicker";
import DatePicker from "@/components/Core/DatePicker";
import FrequencyPicker from "@/components/Core/FrequencyPicker";
import axiosInstance from "@/lib/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import Message from "@/components/Core/Message";
import { mutate } from "swr";
import KeyboardAvoidingScrollView from "@/components/Core/AvoidKeyboard";
import { eventColors } from "@/constants";
import { EventColor } from "@/types/global";
import { getMonth, getYear } from "date-fns";

const Wrapper = () => {
  const categories = ["health_check-in", "milestones", "community"];

  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    note: string;
    date: string;
    repeats: string;
    start: string;
    category: string;
    end: string;
  }>({
    name: "",
    location: "",
    note: "",
    date: new Date().toISOString(),
    repeats: "daily",
    start: "",
    category: "",
    end: "",
  });

  const isValid = !!formData.name && !!formData.start && !!formData.end;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const { id, date } = useLocalSearchParams();

  const { navigate } = useRouter();
  const createAppointment = async () => {
    const newMonth = getMonth(date as string) + 1; // Update month and account for 0-indexing
    const newYear = getYear(date as string); // Update the year
    try {
      setLoading(true);
      !isEdit
        ? await axiosInstance.post("/events", formData)
        : await axiosInstance.put(`/events/${id}`, formData);
      mutate(`/events?date=${date}`);
      navigate("/(app)/(calendar)");
      mutate(`/events/month?month=${newMonth}&year=${newYear}`);
    } catch (error) {
      //@ts-ignore
      setError(error.response.data.message ?? "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async () => {
    try {
      setLoadingEvent(true);
      const { data } = await axiosInstance.get(`/events/${id}`);
      setFormData(data);
    } catch (error) {
      setError(
        //@ts-ignore
        error.response.data.message ??
          //@ts-ignore
          error.response.data.error ??
          "Failed to load event"
      );
    } finally {
      setLoadingEvent(false);
    }
  };
  useEffect(() => {
    if (isEdit) {
      (async () => await fetchEvent())();
    }
  }, []);
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

  const isEdit = !!id;

  const hideKeyboard = () => Keyboard.dismiss();
  return (
    <KeyboardAvoidingScrollView gradient>
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Back />
          <Text className="font-main flex-1 text-center text-base -ml-4">
            {isEdit ? "Update" : "Add new"} event
          </Text>
        </View>
        <View className="my-4">
          <Text className="font-main px-4 text-center text-base">
            Find more in the learn section for tips on organizing your schedule
          </Text>
        </View>
        {error && <Message message={error} isError />}
        {loadingEvent && (
          <View className="items-center">
            <ActivityIndicator />
          </View>
        )}
        <View>
          <Input
            placeholder="Event name*"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <Input
            placeholder="Location"
            value={formData.location}
            onChangeText={(text) => handleChange("location", text)}
          />
          <Input
            placeholder="Note"
            value={formData.note}
            multiline
            onChangeText={(text) => handleChange("note", text)}
          />
        </View>
        <View className="my-4 space-y-2">
          <TouchableOpacity
            onPress={hideKeyboard}
            className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-neutral-200"
          >
            <Text className="font-main text-base">Date</Text>
            <View className="flex-row space-x-2 items-center">
              <DatePicker
                isEdit={isEdit}
                value={formData.date}
                handleChange={handleDate}
              />
              <Feather name="chevron-right" size={20} color={"gray"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={hideKeyboard}
            className="h-[50] rounded-lg flex-row px-3 items-center justify-between bg-neutral-200"
          >
            <Text className="font-main text-base">Repeat</Text>
            <View className="flex-row space-x-2 items-center">
              <FrequencyPicker
                val={formData.repeats}
                handleChange={handleFrequency}
              />
            </View>
          </TouchableOpacity>
          <View className="flex-row justify-between space-x-2">
            <View className="w-[48%]">
              <TimePicker
                isEdit={isEdit}
                value={
                  !!formData.start ? formData.start : new Date().toISOString()
                }
                onChange={handleStart}
                label="Start Time"
              />
            </View>
            <View className="w-[48%]">
              <TimePicker
                isEdit={isEdit}
                value={!!formData.end ? formData.end : new Date().toISOString()}
                label="End Time"
                onChange={handleEnd}
              />
            </View>
          </View>
        </View>
      </View>

      <View className="space-y-2 mb-4">
        <Text className="font-main text0base">
          Select Category (optional tag)
        </Text>
        <View className="flex-row  justify-between ">
          {categories.map((category, index) => (
            <TouchableOpacity
              onPress={() => handleChange("category", category)}
              key={category}
              className={clsx([
                "min-w-[32%] p-3 rounded-full items-center",
                eventColors[category as EventColor].bg,
                formData.category !== category && " opacity-40",
              ])}
            >
              <Text className="text-md font-semibold text-white capitalize">
                {category.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        disabled={!isValid || loading}
        onPress={createAppointment}
        className={clsx([
          "h-[50px] items-center flex-row space-x-2  justify-center bg-ring rounded-full w-full mt-auto",
          !isValid && "opacity-50",
        ])}
      >
        <Text className="font-semibold text-white">
          {isEdit ? "Update" : "Create"} event
        </Text>

        {loading && <ActivityIndicator color={"white"} />}
      </TouchableOpacity>
    </KeyboardAvoidingScrollView>
  );
};

export default Wrapper;
