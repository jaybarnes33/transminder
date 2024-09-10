import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Back from "@/components/Core/Back";

const Login = () => {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    focus: "",
  });

  const { navigate } = useRouter();
  return (
    <SafeAreaView className="bg-purple-50 flex-1 px-4">
      <Back />
      <View className="items-center space-y-1">
        <Text className="font-main font-bold text-2xl text-center text-dark">
          Login to your account
        </Text>
        <Text className="font-main font-semibold text-gray-600 text-center">
          Sign in with your email address
        </Text>
      </View>
      <View className="mt-6 space-y-4">
        <TextInput
          className={clsx([
            "h-12 bg-[#00000010] px-3 py-1 rounded-xl",
            form.focus === "email" && " border-2 border-ring ",
          ])}
          placeholder="Email Address"
          textContentType="emailAddress"
          keyboardType="email-address"
          onFocus={() => setForm({ ...form, focus: "email" })}
        />
        <TextInput
          className={clsx([
            "h-12 bg-[#00000010] px-3 rounded-xl",
            form.focus === "password" && "  border-2 border-ring",
          ])}
          placeholder="**********"
          textContentType="password"
          secureTextEntry
          onFocus={() => setForm({ ...form, focus: "password" })}
        />

        <TouchableOpacity>
          <Text className="font-main text-sm font-bold text-dark ">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
      <View className="items-center w-full space-y-2 mt-3 ">
        <TouchableOpacity
          onPress={() => navigate("/(tabs)")}
          className="bg-dark flex-row space-x-2 w-full items-center h-12 justify-center rounded-full"
        >
          <Text className="font-main text-base text-white font-semibold">
            Login
          </Text>
        </TouchableOpacity>

        <View className="w-full px-6 flex-row justify-center space-x-2 items-center">
          <View className="h-px bg-gray-300  w-1/2  " />
          <Text className="font-main font-semibold text-gray-500">OR</Text>
          <View className="h-px bg-gray-300  w-1/2   " />
        </View>
        <TouchableOpacity className="bg-purple-100 w-full space-x-2 flex-row items-center h-12 justify-center rounded-full">
          <Image
            className="w-6 h-6"
            source={require("@/assets/images/google.png")}
          />
          <Text className="font-main font-semibold text-base">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
