import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import Back from "@/components/Core/Back";
import axiosInstance from "@/lib/axios";

import { setTokens } from "@/utils/auth";
import Message from "@/components/Core/Message";
import Input from "@/components/Core/Input";
import UnAuthContent from "@/components/Auth/UnAuthContent";
import { mutate } from "swr";
import Google from "@/components/Auth/Google";

const Login = () => {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    focus: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { navigate } = useRouter();
  const navigation = useNavigation();
  const handleChange = (key: string, value: string) => {
    setError("");
    setForm({ ...form, [key]: value });
  };
  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/", form);
      await setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      mutate("/auth", data);

      navigate("/(app)/(tabs)");
    } catch (error) {
      //@ts-ignore

      setError(error?.response?.data?.error ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnAuthContent>
      <SafeAreaView className="bg-purple-50 flex-1 px-4">
        <Back action={() => navigate("/Auth")} />

        <View className="items-center gap-y-1">
          <Text className="font-fwbold text-2xl text-center text-dark">
            Login to your account
          </Text>
          <Text className="font-main font-semibold text-gray-600 text-center">
            Sign in with your email address
          </Text>
        </View>
        {error && <Message message={error} isError />}
        {error && error.includes("finish") && (
          <TouchableOpacity
            className="bg-dark rounded-3xl h-[50] items-center justify-center "
            //@ts-ignore
            onPress={() => navigation.navigate("Signup", { email: form.email })}
          >
            <Text className="font-fwbold  font-base text-white">
              Complete sign up
            </Text>
          </TouchableOpacity>
        )}
        <View className="mt-6 gap-y-1">
          <View className="gap-y-1">
            <Input
              placeholder="Email Address"
              textContentType="emailAddress"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>
          <View className="gap-y-1">
            <Input
              placeholder="••••••••"
              textContentType="password"
              value={form.password}
              autoCapitalize="none"
              secureTextEntry
              placeholderTextColor={"gray"}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
          <TouchableOpacity onPress={() => navigate("/(forgot-password)")}>
            <Text className="text-sm font-fwbold text-dark ">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <View className="items-center w-full gap-y-2 mt-6 ">
          <TouchableOpacity
            disabled={loading || !form.email || !form.password}
            onPress={handleLogin}
            className="bg-dark flex-row gap-x-2 w-full items-center h-12 justify-center rounded-full"
          >
            <Text className="font-main text-base text-white font-semibold">
              Login
            </Text>

            {loading && (
              <ActivityIndicator
                className="text-white"
                color="white"
                size="small"
              />
            )}
          </TouchableOpacity>

          <View className="w-full px-6 flex-row justify-center gap-x-2 items-center mb-2">
            <View className="h-px bg-gray-300  w-1/2  " />
            <Text className="font-main font-semibold text-gray-500">OR</Text>
            <View className="h-px bg-gray-300  w-1/2   " />
          </View>
          <Google />
        </View>
      </SafeAreaView>
    </UnAuthContent>
  );
};

export default Login;
