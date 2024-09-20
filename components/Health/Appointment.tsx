import { View, Text } from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";

const Appointment = ({
  appointment,
}: {
  appointment: {
    name: string;
    date: string;
    start: string;
    location: string;
    end: string;
    doctor: string;
  };
}) => {
  return (
    <View className="h-[96] bg-white flex-row space-x-4 p-4 rounded-3xl">
      <View className="flex-1 border-l-4 px-2 border-ring">
        <Text className=" text-sm text-ring font-fwbold capitalize">
          {appointment.date}
        </Text>
        <Text className="font-fwbold text-lg capitalize">
          {appointment.name}
        </Text>
        <View className="flex-row space-x-2 items-center">
          <Ionicons name="location" color="grey" />
          <Text className="font-main text-sm text-neutral-600">
            {appointment.location}
          </Text>
        </View>
      </View>
      <View className="space-y-2 items-center">
        <Text className="font-main text-ring">{appointment.start}</Text>
        <Text className="font-main">{appointment.end}</Text>
      </View>
    </View>
  );
};

export default Appointment;
