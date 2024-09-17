import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import clsx from "clsx";

import { useSignUp } from "@/context/Signup";
import axiosInstance from "@/lib/axios";
import { ErrorObj } from "@/types/global";
import Input from "@/components/Core/Input";

const Two = ({ isResend }: { isResend: boolean }) => {
  const [focus, setFocus] = React.useState(false);
  const { details, handleChange, setMessage, setError } = useSignUp();

  const [resend, setResend] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  useEffect(() => {
    setResend(isResend);
  }, [isResend]);
  useEffect(() => {
    const interval = setInterval(() => {
      setResend(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [resend]);

  const resendOTP = async () => {
    try {
      setSending(true);
      await axiosInstance.post("/auth/otp/resend", { email: details.email });
      setMessage("Code resent successfully");
    } catch (error) {
      setError(
        (error as ErrorObj)?.response?.data.error ?? "Failed to resend code"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="py-5 space-y-5">
      <View className="">
        <Text className="font-main font-fwbold text-center text-2xl mb-1">
          Enter code
        </Text>
        <Text className="font-main font-semibold text-base text-center text-gray-600">
          We sent a verification code to your email
        </Text>
        <Text className="font-main text-center text-base font-semibold">
          {details?.email}
        </Text>
      </View>

      <Input
        value={details?.otp}
        className={clsx([
          "h-12 bg-gray-200 font-main text-2xl font-fwbold px-3 text-center py-1 rounded-xl lowercase",
        ])}
        placeholder="- - - - - -"
        keyboardType="numeric"
        autoCapitalize="none"
        onChangeText={(text) => handleChange("otp", text)}
        maxLength={6}
      />
      {resend && (
        <TouchableOpacity onPress={resendOTP}>
          <Text className="font-main text-sm font-fwbold text-dark text-center">
            Resend code
          </Text>
          {sending && <ActivityIndicator size="small" color={"#bb5adf"} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Two;
