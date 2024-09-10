import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";

const Notifications = () => {
  return (
    <View className="py-5 space-y-5 items-center">
      <View className="space-y-1">
        <Text className="font-main text-dark font-bold text-center text-2xl">
          Get notified
        </Text>
        <Text className="font-main font-semibold text-center text-gray-600">
          Keep up with reminders, updates and more
        </Text>
      </View>

      <Image source={require("@/assets/images/notifications.png")} />
    </View>
  );
};

export default Notifications;
