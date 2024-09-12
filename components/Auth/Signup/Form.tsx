import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { ReactNode, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import { useSignUp } from "@/context/Signup";
import Email from "./Steps/Email";
import clsx from "clsx";
import Otp from "./Steps/Otp";
import Password from "./Steps/Password";
import Name from "./Steps/Name";
import Avatar from "./Steps/Avatar";
import Gender from "./Steps/Gender";
import Notifications from "./Steps/Notifications";
import Privacy from "./Steps/Privacy";

const Form = ({ email }: { email?: string }) => {
  const { step, isValid, next, error, handleChange, continueFromOTP } =
    useSignUp();

  const components: Record<number, ReactNode> = {
    1: <Email />,
    2: <Otp isResend={!!email} />,
    3: <Password />,
    4: <Name />,
    5: <Avatar />,
    6: <Gender />,
    7: <Notifications />,
    8: <Privacy />,
  };
  useEffect(() => {
    if (email) {
      handleChange("email", email);
      continueFromOTP();
    }
  }, [email]);

  const disabled = !isValid(step) || !!error;

  return (
    <SafeAreaView className="bg-purple-50 flex-1 px-4">
      <Header />
      {components[step]}
      <TouchableOpacity
        disabled={disabled}
        onPress={next}
        className={clsx([
          "bg-dark flex-row space-x-2 w-full absolute  bottom-14 ml-4 items-center h-12 justify-center rounded-full",
          disabled && "bg-gray-500",
          step == 8 && "bg-ring",
        ])}
      >
        {step < 8 && (
          <Text className="font-main text-base text-white font-semibold">
            {step !== 7 ? "Next" : "Turn on notifications"}
          </Text>
        )}
        {step === 8 && (
          <Text className="font-main text-base text-white font-semibold">
            Let's Go!
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Form;
