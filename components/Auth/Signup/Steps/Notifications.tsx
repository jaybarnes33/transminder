import { View, Text, Image } from "react-native";
import React from "react";

const Notifications = () => {
  return (
    <View className="py-5 gap-y-5 items-center">
      <View className="gap-y-1">
        <Text className="text-dark font-fwbold text-center text-2xl">
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
