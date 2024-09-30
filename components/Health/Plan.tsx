import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Drug, IconName } from "@/types/global";
import Icon from "../Core/Icon";
import { FlatList } from "react-native-gesture-handler";
import clsx from "clsx";
import Heading from "../Core/Heading";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import EmptyPlan from "./Empty/EmptyPlan";

const Item = ({ drug }: { drug: Drug }) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const currentTime = new Date();
      const targetTime = new Date();

      const [hours, minutes] = drug.times[0].split(":");
      targetTime.setHours(parseInt(hours), parseInt(minutes), 0);

      if (currentTime >= targetTime) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <View
      className={" bg-white rounded-[20px] p-3 mb-2 shadow-sm items-center  "}
    >
      <View className="flex-row justify-between space-x-4 items-center">
        <View
          className={clsx([
            "h-10 w-10 items-center justify-center rounded-full",
            "bg-blue-100",
          ])}
        >
          <Icon name={drug.type as IconName} />
        </View>
        <View className="flex-1">
          <Text className="font-main text-neutral-400 text-sm font-semibold capitalize">
            {drug.type}
          </Text>
          <Text className="font-main text-base font-semibold">{drug.name}</Text>
        </View>
        <View>
          <Text className="font-fwbold text-blue-500 text-capitalize   text-sm capitalize">
            Today, <Text className="uppercase">{drug.times[0]}</Text>
          </Text>
          {!!drug.notes && (
            <View className="flex-row justify-between items-center">
              <Text className="font-main text-neutral-400 font-semibold text-sm">
                1 note
              </Text>
              <Icon name="push-pin" />
            </View>
          )}
        </View>
      </View>
      {showButtons && (
        <View className="flex-row space-x-3 py-3 border-t border-neutral-400 w-full mt-3 flex-1">
          <TouchableOpacity className="flex-1 h-[40] bg-gray-200 rounded-full justify-center">
            <Text className="text-dark text-center font-fwbold  text-sm">
              Skipped
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 h-[40] justify-center rounded-full bg-blue-500">
            <Text className="text-white text-center font-fwbold  text-sm">
              Taken
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const Plan = () => {
  const { navigate } = useRouter();

  const fetchDrugs = async () => {
    const { data } = await axiosInstance.get("/drugs?size=5");
    return data;
  };

  const { data: drugs, isLoading } = useSWR("/medications?size", fetchDrugs);
  return (
    <View className="space-y-2">
      <View className="flex-row items-center justify-between space-x-2">
        <Heading
          text="Your plan"
          more="View plan"
          moreAction={() => navigate("/(medications)")}
        />
      </View>
      <View>
        <FlatList
          data={drugs}
          ListEmptyComponent={EmptyPlan}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Item drug={{ ...item }} />}
        />
      </View>
    </View>
  );
};

export default Plan;
