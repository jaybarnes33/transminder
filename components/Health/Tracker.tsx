import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MoodLog } from "@/types/global";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import Emoji from "../Core/Emoji";
import Icon from "../Core/Icon";
import { startOfDay } from "date-fns";
import clsx from "clsx";

const Tracker = ({ date }: { date: string }) => {
  const isPast = new Date(date) < startOfDay(new Date());
  const { navigate } = useRouter();

  const fetchMoodLog = async () => {
    const {
      data: { moodLog },
    } = await axiosInstance.get(`/mood/date?date=${date}`);
    return moodLog;
  };

  const copy = isPast
    ? {
        title: "Oops! Forgot to log?",
        text: "How was your mood on that day?",
        label: "Let's add it",
      }
    : {
        title: "Daily tracker",
        text: "How are you feeling today?",
        label: "Log your mood",
      };

  const { data, error, isLoading } = useSWR(`/mood/${date}`, fetchMoodLog);
  return isLoading || !data?.mood ? (
    <View
      className={clsx([
        " relative rounded-[20px] h-[126] items-center gap-y-3 pt-4 my-4",
        isPast ? "bg-[#FFA88F]" : "bg-purple-500",
      ])}
    >
      <View className="flex-row items-center justify-center">
        <Emoji name="sun" />
        <Text className="font-main text-white">{copy.title}</Text>
      </View>
      <Text className=" font-base font-fwbold text-white">{copy.text}</Text>
      <TouchableOpacity
        onPress={() =>
          navigate({ pathname: "/(app)/(mood)", params: { date } })
        }
        className="bg-white p-2 w-[144] items-center rounded-[70px] relative z-[99]"
      >
        <Text
          className={clsx([
            "font-fwbold ",
            isPast ? "text-[#FD8C6C]" : "text-purple-500",
          ])}
        >
          {copy.label}
        </Text>
      </TouchableOpacity>
      <Image
        className="absolute w-full bottom-0"
        source={require("@/assets/images/track_bg.png")}
      />
    </View>
  ) : (
    <View className="h-[116px] relative bg-white p-4 rounded-[20px] my-4">
      <Image
        source={require("@/assets/images/tracker-backdrop.png")}
        className="absolute right-0 bottom-0"
      />
      <TouchableOpacity
        onPress={() =>
          navigate({
            pathname: "/(app)/(mood)",
            params: { id: data._id, date },
          })
        }
        className="absolute right-4 top-4 bg-gray-200 px-5 rounded-full py-2 z-[99]"
      >
        <Text>Update</Text>
      </TouchableOpacity>
      <View className="gap-y-2">
        <View className="flex-row gap-x-1 items-center">
          <Icon name="sun" />
          <Text className="text-ring font-fwbold capitalize text-sm ">
            Daily tracker
          </Text>
        </View>
        <Text className="font-fwbold text-base">Feeling {data.mood}</Text>
        <View className="flex-row gap-x-3">
          {data.feelings.map((item: string) => (
            <View
              className="flex-row gap-x-1 bg-[#EEFBF3] py-1 px-3 rounded-full items-center"
              key={item}
            >
              <Emoji name={item} size="sm" />
              <Text className="font-fwbold text-gray-400 text-xs capitalize">
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Tracker;
