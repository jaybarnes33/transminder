import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import UnAuthContent from "@/components/Auth/UnAuthContent";
import Google from "@/components/Auth/Google";

const Auth = () => {
  const { navigate } = useRouter();

  return (
    <UnAuthContent>
      <SafeAreaView className="bg-purple-50 flex-1 px-4">
        <View className="items-center h-[70vh] justify-center  space-y-4">
          <Image source={require("@/assets/images/logo2.png")} />
          <View className="w-full items-center">
            <Text className="font-fwbold font-main text-2xl text-center">
              Welcome to Transminder
            </Text>
            <Text className="text-center font-main max-w-[200px] ">
              Your trans health companion, to manage it all.
            </Text>
          </View>
        </View>
        <View className="items-center w-full space-y-2 ">
          <Google />
          <View className="w-full px-6 flex-row justify-center space-x-2 items-center">
            <View className="h-px bg-gray-300  w-1/2  " />
            <Text className="font-main font-semibold text-gray-500">OR</Text>
            <View className="h-px bg-gray-300  w-1/2   " />
          </View>
          <TouchableOpacity
            onPress={() => navigate("/Signup")}
            className="bg-dark flex-row space-x-2 w-full items-center h-12 justify-center rounded-full"
          >
            <Image
              className="w-6 h-6"
              source={require("@/assets/images/mail.png")}
            />
            <Text className="font-main text-base text-white font-semibold">
              Signup with email
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mt-auto">
          <TouchableOpacity
            onPress={() => navigate("/Login")}
            className="flex-row space-x-2 items-center h-10 justify-center"
          >
            <Text className="font-main font-semibold text-dark">
              Already have an account?
            </Text>
            <Text className="font-main font-semibold text-purple-500">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </UnAuthContent>
  );
};

export default Auth;
