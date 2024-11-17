import { Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axiosInstance from "@/lib/axios";
import { setTokens } from "@/utils/auth";
import { mutate } from "swr";
import { useRouter } from "expo-router";
const Google = () => {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_ID, // From Google Console
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID, // From Google Console
    });
  }, []);

  const { navigate } = useRouter();
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      console.log(userInfo);

      const { data } = await axiosInstance.post("/auth/google", {
        token: userInfo.data?.idToken,
      });
      await setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      mutate("/auth", data);

      navigate("/(app)/(tabs)");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.error(error);
      }
    }
  };
  return (
    <TouchableOpacity
      onPress={signInWithGoogle}
      className="bg-purple-100 w-full gap-x-2 flex-row items-center h-12 justify-center rounded-full"
    >
      <Image
        className="w-6 h-6"
        source={require("@/assets/images/google.png")}
      />
      <Text className="font-main font-semibold text-base">
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
};

export default Google;
