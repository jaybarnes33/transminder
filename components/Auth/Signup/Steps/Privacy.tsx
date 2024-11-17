import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";

const Privacy = () => {
  return (
    <View className="py-5 gap-y-14 items-center">
      <View>
        <Text className="font-fwbold text-center text-2xl">
          Your data, Your rules!
        </Text>
        <Text className="font-main font-semibold text-sm text-center text-gray-600">
          We only use your data to power Transminder—
        </Text>
        <Text className="font-main font-semibold text-sm text-center text-gray-600">
          no one else gets it. You can delete it whenever
        </Text>
        <Text className="font-main font-semibold text-sm text-center text-gray-600">
          you like!
        </Text>
      </View>

      <Image source={require("@/assets/images/data.png")} />

      <View className="top-28 py-2 flex-row gap-x-3 ">
        <View className="mt-2">
          <AntDesign name="checkcircle" size={15} color="#b85adf" />
        </View>
        <View>
          <Text className="font-main font-semibold text-base text-center text-dark">
            By continuing, you agree to our
          </Text>
          <View className="flex-row items-center gap-x-1">
            <TouchableOpacity>
              <Text className="font-main font-semibold text-base text-center text-purple-500">
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text className="font-main font-semibold text-base text-center">
              and
            </Text>
            <TouchableOpacity>
              <Text className="font-main font-semibold text-base text-center text-purple-500">
                Terms of Use
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Privacy;
