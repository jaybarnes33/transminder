import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "date-fns";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { EventColor, IEvent } from "@/types/global";
import EventDetail from "./EventDetail";
import { eventColors } from "@/constants";
import clsx from "clsx";
import Icon from "../Core/Icon";

const Appointment = ({ event, date }: { event: IEvent; date?: string }) => {
  const { showModal } = useBottomSheetModal();

  const color =
    eventColors[(event.category ? event.category : "event") as EventColor];

  console.log(color.text);
  return (
    <TouchableOpacity
      onPress={() => showModal(<EventDetail event={event} date={date} />)}
      className=" bg-white flex-row space-x-4  p-4  my-2 rounded-3xl "
    >
      <View className={clsx(["flex-1  border-l-[3px] px-2 ", color.border])}>
        <Text
          className={clsx([
            " text-sm  font-fwbold capitalize",
            color && color.text,
          ])}
        >
          {formatDate(!!date ? date : event.date, "eeee, dd LLLL")}
        </Text>
        <Text className="font-semibold text-lg capitalize">{event.name}</Text>
        {!!event.location && (
          <View className="flex-row space-x-2 items-center">
            <Icon name="location" />
            <Text className="font-semibold text-sm text-neutral-500">
              {event.location}
            </Text>
          </View>
        )}
        {!!event.note && (
          <Text className="font-semibold text-sm text-neutral-500">
            {event.note.substring(0, 20)}...
          </Text>
        )}
      </View>
      <View className="space-y-2 items-center">
        <Text
          className={clsx([" text-sm  font-semibold ", color && color.text])}
        >
          {formatDate(event.start, "hh:mm aa")}
        </Text>
        <Text className="font-main font-semibold">
          {" "}
          {formatDate(event.end, "hh:mm aa")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Appointment;
