import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Heading from "../Core/Heading";
import Appointment from "./Appointment";
import { useRouter } from "expo-router";
import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import { FlatList } from "react-native-gesture-handler";

const Appointments = ({ limitted }: { limitted?: boolean }) => {
  const { navigate } = useRouter();

  const { data, isLoading } = useSWR("/events", async () => {
    const { data: res } = await axiosInstance.get("/events");
    return res;
  });

  return (
    <View className="mb-4">
      {!limitted && (
        <View className="mt-4">
          <Heading
            text="Appointments"
            more="View Calendar"
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
            ListEmptyComponent={
              <View>
                <Text>No appointments scheduled</Text>
              </View>
            }
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Appointment event={item} />}
          />
        )}
      </View>
    </View>
  );
};

export default Appointments;
