import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { drugs } from "@/constants";
import Icon from "@/components/Core/Icon";
import { Drug, IconName } from "@/types/global";
import clsx from "clsx";
import Back from "@/components/Core/Back";
import { useRouter } from "expo-router";

const Item = ({ drug }: { drug: Drug }) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const currentTime = new Date();
      const targetTime = new Date();

      const [hours, minutes] = drug.times[0].time.split(":");
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
            Today, <Text className="uppercase">{drug.times[0].time}</Text>
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="font-main text-neutral-400 font-semibold text-sm">
              {drug.notes.length} note{drug.notes.length > 2 ? "s" : ""}
            </Text>
            <Icon name="push-pin" />
          </View>
        </View>
      </View>
      {showButtons && (
        <View className="flex-row space-x-3 py-3 border-t border-neutral-400 w-full mt-3 flex-1">
          <TouchableOpacity className="flex-1 h-[40] bg-neutral-200 rounded-full justify-center">
            <Text className="text-dark text-center font-fwbold text-sm">
              Skipped
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 h-[40] justify-center rounded-full bg-blue-500">
            <Text className="text-white text-center font-fwbold text-sm">
              Taken
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Medications = () => {
  const { navigate } = useRouter();
  return (
    <SafeAreaView className="px-4 bg-gray-100  flex-1">
      <View className="space-y-4">
        <View className="flex-row items-center justify-between space-x-4">
          <Back />
          <TouchableOpacity onPress={() => navigate("/add")}>
            <Text className="font-main text-base text-blue-500 font-semibold">
              Add Medication
            </Text>
          </TouchableOpacity>
        </View>
        <Text className=" text-3xl font-fwbold">
          All Medications{" "}
          <Text className=" text-neutral-400">{drugs.length}</Text>
        </Text>

        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={drugs}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <Item drug={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Medications;
