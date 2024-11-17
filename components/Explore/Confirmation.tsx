import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Sign from "./Sign";
import clsx from "clsx";
import { useUser } from "@/context/Auth";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";

const Confirmation = () => {
  const { navigate, replace } = useRouter();

  const [sign, setSign] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleAgree = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(`/users/${user?._id}`, { hasMapsAccess: true });
      await mutate("/auth");
      replace("/(tabs)/explore");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="px-4 items-center flex-1 gap-y-9">
      <View className="gap-y-3 w-full">
        <Text className="text-base text-neutral-500 font-semibold text-center">
          Welcome to the Map!
        </Text>
        <Text className="text-3xl font-fwbold text-center">Unlock access!</Text>
        <TouchableOpacity
          onPress={() => navigate("/(app)/(tabs)/")}
          className="absolute right-4 -top-3"
        >
          <Feather name="x" size={20} color={"gray"} />
        </TouchableOpacity>
      </View>

      <Image source={require("@/assets/images/explore.png")} />

      <Text className="font-semibold text-base text-center">
        For everyone's safety, please agree to: respect others, keep the map for
        personal use only, report any issues, and understand that misuse may
        result in losing access and/or legal action.
      </Text>

      <Sign
        sign={sign}
        text="Ready to commit? Sign or draw a heart 💜"
        onOK={setSign}
      />
      <TouchableOpacity
        onPress={handleAgree}
        className={clsx([
          "bg-neutral-600 flex-row h-[50] gap-x-2 items-center justify-center w-full rounded-full mt-auto mb-5",
          sign.length > 0 && " bg-dark",
        ])}
      >
        <Text className="font-fwbold text-white">I agree</Text>
        {loading && <ActivityIndicator color={"white"} />}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Confirmation;
