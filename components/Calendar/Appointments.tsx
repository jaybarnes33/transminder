import { View, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import Heading from "../Core/Heading";
import Appointment from "./Appointment";
import { useRouter } from "expo-router";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import EmptyEvents from "../Health/Empty/EmptyEvents";

const Appointments = ({
  limitted,
  date,
}: {
  limitted?: boolean;
  date?: string;
}) => {
  const { navigate } = useRouter();

  const { data, isLoading } = useSWR(
    `/events?date=${date ? date : ""}`,
    async () => {
      const { data: res } = await axiosInstance.get(
        `/events?date=${!limitted ? date : ""}&limit=5`
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
      <View className="mt-2">
        {isLoading ? (
          <View className="items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={data}
            ListEmptyComponent={<EmptyEvents />}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Appointment event={item} date={date} />}
          />
        )}
      </View>
    </View>
  );
};

export default Appointments;
