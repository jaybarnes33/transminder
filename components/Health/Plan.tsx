import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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
import { differenceInMinutes, format } from "date-fns";
import { getDrugStatus } from "@/utils";
import { icons } from "@/constants/icons";

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

      const diff = differenceInMinutes(targetTime, currentTime);

      if (diff <= 60) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const canEdit = showButtons && item.status === "pending";
  const changeState = async (action: "skipped" | "taken") => {
    setLoading((prev) => ({ ...prev, [action]: true }));
    await axiosInstance.get(`/drugs/intake/${item._id}?action=${action}`);
    setAllowChange(false);
    mutate("/intake?size");
    mutate("/intake/analytics");
    setLoading((prev) => ({ ...prev, [action]: false }));
  };

  const splitTime = item.time.split(":").map((t) => Number.parseInt(t));

  const time = new Date();
  time.setHours(splitTime[0], splitTime[1]);

  const status = getDrugStatus(item.status, item.time);

  const [allowChange, setAllowChange] = useState(false);
  return (
    <View
      className={clsx([
        " bg-white rounded-[20px] p-3 mb-2 shadow-sm items-center",
        canEdit || (allowChange && "h-[140px]"),
      ])}
    >
      <TouchableOpacity
        disabled={status === "pending"}
        onPress={() => setAllowChange(true)}
        className="flex-row justify-between space-x-4 items-center"
      >
        <View
          className={clsx([
            "h-10 w-10 items-center justify-center rounded-full",
            "bg-blue-100",
          ])}
        >
          <Icon name={item.drug?.type as IconName} />
        </View>
        <View className="flex-1">
          <Text className="font-main text-neutral-400 text-sm font-semibold capitalize">
            {item.drug?.type}
          </Text>
          <Text className="font-main text-base font-semibold">
            {item.drugName}
          </Text>
        </View>
        <View>
          <Text
            className={clsx([
              "font-fwbold text-blue-500    text-sm capitalize",
              item.status !== "pending" && "text-neutral-400",
            ])}
          >
            {item.status !== "pending" ? "Earlier today" : "Today"},
            <Text className="uppercase"> {format(time, "hh:mm aa")}</Text>
          </Text>
          {!!item.drug?.notes && (
            <View className="flex-row  justify-end items-center">
              <Text className=" mr-2 text-neutral-400 font-fwbold text-xs">
                1 note attached
              </Text>
              <Icon name="push-pin" />
            </View>
          )}
          {status !== "pending" && (
            <View
              className={clsx([
                "ml-auto flex-row mt-1 h-5 items-center justify-center",
              ])}
            >
              <Text
                className={clsx([
                  "font-semibold text-sm capitalize",
                  status === "skipped" && "text-dark",
                  status === "taken" && "text-blue-500",
                  status === "missed" && "text-red-500",
                ])}
              >
                {status}&nbsp;
              </Text>
              <Text>{icons[status as keyof typeof icons]}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {(canEdit || allowChange) && (
        <View className="flex-row space-x-3 py-3 w-full mt-3 flex-1">
          <Image
            className="absolute w-full"
            source={require("@/assets/images/line.png")}
          />
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
    const { data } = await axiosInstance.get("/drugs/intake/generate");

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
          more="View meds"
          moreAction={() => navigate("/(medications)")}
        />
      </View>
      <View>
        <FlatList
          data={drugs}
          ListEmptyComponent={<EmptyPlan />}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Item item={{ ...item }} />}
        />
      </View>
    </View>
  );
};

export default Plan;
