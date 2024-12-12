import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import { format } from "date-fns";
import clsx from "clsx";
import Feeling from "@/components/Health/Feeling";
import Icon from "@/components/Core/Icon";
import axiosInstance from "@/lib/axios";
import Message from "@/components/Core/Message";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mutate } from "swr";
import { MoodLog } from "@/types/global";

const Mood = () => {
  const moods = ["terrible", "bad", "okay", "good", "awesome"];

  const { date = new Date().toISOString() } = useLocalSearchParams();
  const feelings = [
    "happy",
    "tired",
    "beamy",
    "anxious",
    "confused",
    "satisfied",
    "surprised",
    "enthusiastic",
    "angry",
    "annoyed",
    "sick",
    "unamused",
    "empty",
    "not sure",
    "sad",
    "desperate",
  ];

  const [moodData, setMoodData] = useState<Omit<MoodLog, "createdAt" | "date">>(
    {
      mood: "",
      feelings: [],
      notes: "",
    }
  );

  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { navigate } = useRouter();

  const handleChange = (key: string, value: string) => {
    setError("");
    setMoodData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFeelings = (key: string, value: string) => {
    setError("");
    setMoodData((prev) => ({
      ...prev,
      [key]: prev.feelings.includes(value)
        ? prev.feelings.filter((feeling) => feeling !== value)
        : [...prev.feelings, value],
    }));
  };

  const getMoodLog = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/mood/${id}`);
      setMoodData(data);
    } catch (error) {
      //@ts-ignore
      setError(error.response.data.message ?? "Failed to load mood");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => await getMoodLog())();
    }
  }, []);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/mood", { ...moodData, date });
      await Promise.all([
        mutate(`/mood/${date}`),
        mutate("/mood"),
        mutate((key: string[]) => key[0].startsWith("/mood-insights")),
      ]);

      navigate("/(app)/(tabs)");
    } catch (error) {
      //@ts-ignore
      setError(error.response.data.message ?? "Failed to log mood");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="px-4 gap-y-4">
      {error && <Message message={error} isError />}
      <View className="flex-row items-center justify-between">
        <Back />
        <Text className="font-main text-base text-center flex-1 -ml-4">
          {format(new Date(date as string), "EEEE, d LLLL yyy")}{" "}
        </Text>
      </View>
      <ScrollView
        className="gap-y-10 h-[75vh]"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-fwbold text-center">
          How are you feeling?
        </Text>
        <View className="gap-y-2 ">
          <Text className="font-semibold text-base">Mood</Text>
          <View className="flex-row justify-between gap-x-4 px-4 py-5 bg-white  items-center rounded-[20px]">
            {moods.map((mood) => (
              <Feeling
                item={mood}
                isActive={moodData.mood === mood}
                key={mood}
                type="mood"
                onPress={handleChange}
              />
            ))}
          </View>
        </View>
        <View className="gap-y-2">
          <Text className="font-semibold text-base">Feeling</Text>
          <View className="flex-row  justify-between  flex-wrap px-4x py-5 bg-white  items-center rounded-[20px] gap-y-3">
            {feelings.map((feeling) => (
              <Feeling
                key={feeling}
                item={feeling}
                type="feeling"
                isActive={moodData.feelings.includes(feeling)}
                onPress={() => handleFeelings("feelings", feeling)}
              />
            ))}
          </View>
        </View>
        <View className="gap-y-4  pb-40">
          <Text className="font-semibold text-base">Add note</Text>
          <View className="relative">
            <View className="flex-row h-[100px] items-start rounded-xl bg-gray-200">
              <TextInput
                className="flex-1  p-4"
                multiline
                numberOfLines={10}
                value={moodData.notes}
                onChangeText={(text) => handleChange("notes", text)}
                placeholder="Share what's on your mind...."
              />
              <View className="p-4">
                <Icon name="pencil" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className=" relative -left-4 p-4 bg-white h-[200px]  w-screen">
        <TouchableOpacity
          onPress={handleSubmit}
          className="h-[50px] w-full flex-row gap-x-2 items-center justify-center rounded-[50px] bg-ring"
        >
          <Text className="font-semibold text-base text-white">Apply</Text>

          {loading && <ActivityIndicator color="white" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Mood;
