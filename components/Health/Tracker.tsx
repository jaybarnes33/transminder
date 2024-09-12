import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const Tracker = () => {
  return (
    <View className="bg-purple-500 relative rounded-[20pt] h-[126] items-center space-y-3 pt-4 mt-4">
      <View>
        <Text className="font-main text-white">Daily Tracker</Text>
      </View>
      <Text className="font-main font-base font-bold text-white">
        How are you feeling today?
      </Text>

      <TouchableOpacity className="bg-white p-2 w-[144] items-center rounded-[70pt] relative z-[99]">
        <Text className="font-main font-bold text-purple-500">
          Log your mood
        </Text>
      </TouchableOpacity>
      <Image
        className="absolute w-full bottom-0"
        source={require("@/assets/images/track_bg.png")}
      />
    </View>
  );
};

export default Tracker;
