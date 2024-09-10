import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";
import Avatar from "@/components/Core/Avatar";
import { FontAwesome6 } from "@expo/vector-icons";

const Screen = () => {
  const [focus, setFocus] = React.useState(false);
  const { details, handleChange } = useSignUp();

  return (
    <View className="py-5 space-y-5">
      <View className="">
        <Text className="font-main font-bold text-center text-2xl mb-1">
          Add your picture
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          Customize your profile
        </Text>
      </View>

      <View className="items-center">
        <Avatar name={details?.name!} size="xl" />
      </View>

      <TouchableOpacity className="items-center">
        <View className="items-center flex-row space-x-2">
          <FontAwesome6 name="camera" size={16} color="#a855f7" />
          <Text className="font-main text-base font-semibold text-purple-500">
            Add photo
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Screen;
