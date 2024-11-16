import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import Input from "@/components/Core/Input";
import Back from "@/components/Core/Back";
import Emoji from "@/components/Core/Emoji";
import Switch from "@/components/Core/Switch";
import { useBottomSheetModal } from "@/context/BottomSheet";
import ReminderSetup from "@/components/Gallery/ReminderSetup";
import { formatDate } from "date-fns";
import axiosInstance from "@/lib/axios";
import { Album } from "@/types/global";
import { mutate } from "swr";

const suggestedTitles = [
  "Hair growth",
  "Blood tests",
  "Face",
  "Recovery",
  "Surgery",
  "Fitness",
  "Social",
];

export default function NewAlbum() {
  const router = useRouter();

  const [reminderEnabled, setReminderEnabled] = useState(false);

  const [albumData, setAlbumData] = useState<{
    name: string;
    reminder?: {
      date?: string;
      time?: string;
      repeat?: string;
      repeatFrequency?: number;
    };
  }>({
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleReminder = () => setReminderEnabled((prev) => !prev);

  const { showModal } = useBottomSheetModal();

  const setAlbumName = (name: string) => {
    setAlbumData({ ...albumData, name });
  };
  const handleReminder = (reminder: {
    date: string;
    time: string;
    repeat: string;
    repeatFrequency: number;
  }) => {
    setAlbumData({
      ...albumData,
      reminder,
    });
  };

  useEffect(() => {
    if (reminderEnabled) {
      Keyboard.dismiss();
      showModal(
        <ReminderSetup onChange={(reminder) => handleReminder(reminder)} />
      );
    }
  }, [reminderEnabled]);

  const addAlbum = async () => {
    try {
      setLoading(true);
      if (!albumData.name) {
        return alert("Album name is required");
      }
      await axiosInstance.post("/albums", albumData);
      mutate("/albums");
      router.navigate("/(app)/(tabs)/gallery");
    } catch (error) {
      alert("Failed to create album ");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center ">
          <Back />
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-gray-500 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text className="text-2xl font-fwbold text-center mt-4 mb-3">
            New album
          </Text>

          {/* Album Name Input */}
          <View className="mb-6">
            <Text className="text-gray-600 text-center text-base font-main mb-4">
              Enter a name for this album
            </Text>
            <Input
              value={albumData.name}
              onChangeText={setAlbumName}
              placeholder=""
              autoFocus
            />
          </View>

          {/* Suggested Titles */}
          <View className="mb-8">
            <Text className="text-gray-600 font-semibold mb-3">
              Suggested titles
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {suggestedTitles.map((title) => (
                <TouchableOpacity
                  key={title}
                  onPress={() => setAlbumName(title)}
                  className="bg-white border border-purple-400 rounded-full px-4 py-2"
                >
                  <Text className="text-purple-600 font-main">{title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reminder Section */}
          <View className="flex-row space-x-1   mb-8">
            <View className="flex-row justify-between">
              <View className="mt-2">
                <Emoji name="bell" />
              </View>
              <View className="w-3/4">
                <Text className="text-base font-semibold">Set a reminder</Text>
                <Text className="text-gray-500 font-main w-full text-sm">
                  Choose when, and we'll remind you to track your journey!
                </Text>
              </View>

              <Switch value={reminderEnabled} onPress={toggleReminder} />
            </View>
          </View>

          {albumData?.reminder?.date && (
            <View className="bg-purple-50 px-3 h-[50] rounded  justify-center my-4">
              <Text className="font-semibold text-purple-500 text-base">
                Starts &nbsp;
                {
                  formatDate(new Date(albumData.reminder.date), "PPP").split(
                    ","
                  )[0]
                }
                , {albumData?.reminder?.repeat!.replace("everyday", "Daily")}
              </Text>
            </View>
          )}

          {/* Create Button */}
          <TouchableOpacity
            className="bg-purple-500 flex-row rounded-full h-[50px] mb-4 items-center justify-center"
            onPress={addAlbum}
          >
            {loading && <ActivityIndicator color={"white"} />}
            <Text className="text-white text-center text-base font-fwbold">
              Create
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
