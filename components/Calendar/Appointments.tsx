import { View, ActivityIndicator } from "react-native";
import React from "react";
import Heading from "../Core/Heading";
import Appointment from "./Appointment";
import { useRouter } from "expo-router";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyEvents from "../Health/Empty/EmptyEvents";
import { FlashList } from "@shopify/flash-list";
import { IEvent } from "@/types/global";
import clsx from "clsx";

const Appointments = ({
  limitted,
  date,
}: {
  limitted?: boolean;
  date?: string;
}) => {
  const { navigate } = useRouter();

  const { data, isLoading } = useSWR<IEvent[]>(
    `/events?date=${date ? date : ""}`,
    async () => {
      const { data: res } = await axiosInstance.get(
        `/events?date=${!limitted ? date : ""}&limit=${limitted ? 5 : ""}`
      );

      return res.events;
    }
  );

  return (
    <View className="mb-4">
      {limitted && (
        <View className="mt-4">
          <Heading
            text="Appointments"
            more="View calendar"
            moreAction={() => navigate("/(app)/(calendar)")}
          />
        </View>
      )}
      <View className="mt-2 w-full  ">
        {isLoading ? (
          <View className="items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <View className={clsx(!limitted && "h-[50vh]")}>
            <FlashList
              // contentContainerStyle={{ paddingBottom: !limitted ? 200 : 0 }}
              showsVerticalScrollIndicator={false}
              data={data}
              estimatedItemSize={4}
              ListEmptyComponent={<EmptyEvents />}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Appointment event={item} date={date} />
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Appointments;
