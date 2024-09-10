import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import clsx from "clsx";
import { useRouter } from "expo-router";
import { useSignUp } from "@/context/Signup";

const Privacy = () => {
  const [focus, setFocus] = React.useState(false);
  const { details, handleChange } = useSignUp();
  return (
    <View className="py-5 space-y-10 items-center">
      <View>
        <Text className="font-main font-bold text-center text-2xl">
          Your data, Your rules!
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          We only use your data to power Transminder—
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          no one else gets it. You can delete it whenever
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          you like!
        </Text>
      </View>

      <Image source={require("@/assets/images/data.png")} />
    </View>
  );
};

export default Privacy;
