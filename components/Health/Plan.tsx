import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Drug, IconName, Intake } from "@/types/global";
import Icon from "../Core/Icon";
import { FlatList } from "react-native-gesture-handler";
import clsx from "clsx";
import Heading from "../Core/Heading";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate } from "swr";
import EmptyPlan from "./Empty/EmptyPlan";

const Item = ({ item }: { item: Intake }) => {
  const [showButtons, setShowButtons] = useState(false);

  const [loading, setLoading] = useState({
    taken: false,
    skipped: false,
  });

  useEffect(() => {
    const checkTime = () => {
      const currentTime = new Date();
      const targetTime = new Date();

      const [hours, minutes] = item.time.split(":");
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

  const changeState = async (action: "skipped" | "taken") => {
    setLoading((prev) => ({ ...prev, [action]: true }));
    await axiosInstance.get(`/drugs/intake/${item._id}?action=${action}`);

    mutate("/intake?size");
    setLoading((prev) => ({ ...prev, [action]: false }));
  };

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
          <Icon name={item.drug.type as IconName} />
        </View>
        <View className="flex-1">
          <Text className="font-main text-neutral-400 text-sm font-semibold capitalize">
            {item.drug.type}
          </Text>
          <Text className="font-main text-base font-semibold">
            {item.drugName}
          </Text>
        </View>
        <View>
          <Text className="font-fwbold text-blue-500 text-capitalize   text-sm capitalize">
            Today, <Text className="uppercase">{item.time}</Text>
          </Text>
          {/* {!!drug?.notes && (
            <View className="flex-row justify-between items-center">
              <Text className="font-main text-neutral-400 font-semibold text-sm">
                1 note
              </Text>
              <Icon name="push-pin" />
            </View>
          )} */}
        </View>
      </View>
      {showButtons && (
        <View className="flex-row space-x-3 py-3 border-t border-neutral-400 w-full mt-3 flex-1">
          <TouchableOpacity
            onPress={() => changeState("skipped")}
            className="flex-1 h-[40] bg-gray-200  space-x-2 flex-row rounded-full justify-center items-center"
            disabled={loading.skipped}
          >
            <Text className="text-dark text-center font-fwbold  text-sm">
              Skipped
            </Text>

            {loading.skipped && <ActivityIndicator color={"black"} />}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading.taken}
            onPress={() => changeState("taken")}
            className="flex-1 flex-row space-x-2 h-[40] justify-center items-center rounded-full bg-blue-500"
          >
            <Text className="text-white text-center font-fwbold  text-sm">
              Taken
            </Text>

            {loading.taken && <ActivityIndicator color={"white"} />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const Plan = () => {
  const { navigate } = useRouter();

  const fetchDrugs = async () => {
    const { data } = await axiosInstance.get("/drugs/intake/?size=5");

    return data;
  };

  const generateIntakes = async () => {
    const { data } = await axiosInstance.get("/drugs/intake/generate/?size=5");

    mutate("/intake?size");
    return data;
  };

  useSWR("/intake/generate", generateIntakes, { refreshInterval: 1000 });
  const { data: drugs, isLoading } = useSWR("/intake?size", fetchDrugs);
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
          renderItem={({ item }) => <Item item={{ ...item }} />}
        />
      </View>
    </View>
  );
};

export default Plan;
