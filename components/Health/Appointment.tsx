import { View, Text } from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { formatDate } from "date-fns";

const Appointment = ({
  event,
}: {
  event: {
    name: string;
    date: string;
    start: string;
    location: string;
    end: string;
    doctor: string;
  };
}) => {
  return (
    <View className=" bg-white flex-row space-x-4 p-4  my-2 rounded-3xl">
      <View className="flex-1 border-l-4 px-2 border-ring">
        <Text className=" text-sm text-ring font-fwbold capitalize">
          {formatDate(event.date, "eeee, dd LLLL")}
        </Text>
        <Text className="font-fwbold text-lg capitalize">{event.name}</Text>
        <View className="flex-row space-x-2 items-center">
          <Ionicons name="location" color="grey" />
          <Text className="font-main text-sm text-neutral-600">
            {event.location}
          </Text>
        </View>
      </View>
      <View className="space-y-2 items-center">
        <Text className="font-main text-ring">
          {formatDate(event.start, "hh:mmaa")}
        </Text>
        <Text className="font-main"> {formatDate(event.end, "hh:mmaa")}</Text>
      </View>
    </View>
  );
};

export default Appointment;
