import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";

import { format, formatDate, getMonth } from "date-fns";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { IEvent } from "@/types/global";
import { useRouter } from "expo-router";
import { mutate } from "swr";
import axiosInstance from "@/lib/axios";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import Icon from "../Core/Icon";
import { FontAwesome6 } from "@expo/vector-icons";
import clsx from "clsx";
import { eventColors } from "@/constants";

const EventDetail = ({ event, date }: { event: IEvent; date?: string }) => {
  const { navigate } = useRouter();
  const { dismissModal } = useBottomSheetModal();
  const editEvent = () => {
    navigate({
      pathname: "/(app)/(calendar)/add",
      params: {
        id: event._id,
        date,
      },
    });

    dismissModal();
  };

  const newMonth = getMonth(date as string);
  const newYear = getMonth(date as string);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteEvent = async () => {
    if (!confirm) {
      setConfirm(true);
    } else {
      try {
        setDeleting(true);
        await axiosInstance.delete(`/events/${event._id}`);
        await mutate((key: string) => key.startsWith("/event"));
        mutate(`/events?date=${date}`);
        mutate(`/events/month?month=${newMonth}&year=${newYear}`);
        dismissModal();
      } catch (error) {
        //@ts-ignore
        alert(error.response.data.error ?? `Failed to delete ${event.name}`);
      } finally {
        setDeleting(false);
        setConfirm(false);
      }
    }
  };

  const color =
    eventColors[
      (event.category ? event.category : "event") as keyof typeof eventColors
    ];
  return (
    <View className="h-full">
      <View className="relative z-0  h-full">
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient
              id="grad"
              x1="196.5"
              y1="764"
              x2="196.5"
              y2="94"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={color.color} />
              <Stop offset="1" stopColor="#F9FAFB" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" rx={15} height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <View className="absolute p-4 mt-[3vh] w-full">
        <View className="items-center gap-y-2">
          <View
            className={clsx([
              "rounded-xl min-w-[70px] px-3 h-[30px] items-center justify-center",
              color && color.bg,
            ])}
          >
            <Text className="font-semibold capitalize text-white">
              {event.category ? event.category.replace("_", " ") : "event"}
            </Text>
          </View>
          <Text className="font-fwbold  text-xl text-dark">{event.name}</Text>
          <Text className={clsx("text-base font-semibold", color.text)}>
            {formatDate(
              new Date(!!date ? date : event.date),
              "EEEE, MMMM dd yyyy"
            )}
          </Text>
        </View>
        <View className="mt-8 bg-white p-4 gap-y-3 rounded-[20px] shadow">
          <View className="flex-row justify-between border-b border-gray-300 pb-2">
            <Text className="font-semibold text-gray-400">Time</Text>
            <Text className="font-semibold text-dark">
              {format(event.start, "hh:mm a")}{" "}
              <FontAwesome6 name="arrow-right-long" />{" "}
              {format(event.end, "hh:mm a")}
            </Text>
          </View>
          <View
            className={clsx([
              "flex-row justify-between  pb-2",
              !!event.note && "border-b border-gray-300",
            ])}
          >
            <Text className="font-semibold text-gray-400">Location</Text>
            <Text className="font-semibold text-dark capitalize">
              {!!event.location ? event.location : "N/A"}
            </Text>
          </View>

          {!!event.note && (
            <View className="flex-col justify-between gap-y-1 pb-2">
              <Text className="font-semibold text-gray-400">
                {" "}
                <Icon name="push-pin" /> Note attached
              </Text>
              <Text className="font-semibold text-dark ">{event.note}</Text>
            </View>
          )}
        </View>
      </View>
      <View className="absolute items-center w-full gap-y-2 bottom-0 py-10">
        <TouchableOpacity
          onPress={editEvent}
          className="items-center px-5 rounded-full py-1 bg-gray-100 "
        >
          <Text className="text-base font-semibold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteEvent}
          className="items-center px-5 py-1 bg-[#f072722f] flex-row rounded-full"
        >
          <Text className="text-base font-semibold text-red-500">Delete</Text>
          {deleting && <ActivityIndicator color={"white"} />}
        </TouchableOpacity>
        {confirm && (
          <Text className="text-red-500 font-semibold text-base">
            Press the delete button again to confirm
          </Text>
        )}
        <Text className="font-semibold text-gray-500">
          Added on {formatDate(event.createdAt, "MMMM dd, yyyy")}
        </Text>
      </View>
    </View>
  );
};

export default EventDetail;
