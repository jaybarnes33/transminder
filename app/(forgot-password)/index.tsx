import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/Core/Input";
import { TouchableOpacity } from "react-native-gesture-handler";
import { containsNumber, containsSymbol, isValidEmail } from "@/utils";
import clsx from "clsx";
import axiosInstance from "@/lib/axios";
import Back from "@/components/Core/Back";
import { ErrorObj } from "@/types/global";
import Message from "@/components/Core/Message";
import Validation from "@/components/Auth/Validation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { logout } from "@/utils/auth";
import { useUser } from "@/context/Auth";

const Forgot = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    otp: "",
    password: "",
  });
  const [resend, setResend] = React.useState(false);
  const [loadingOtp, setLoadingOtp] = React.useState(false);
  const [id, setId] = React.useState("");

  const { email }: { email: string } = useLocalSearchParams();

  const { logOut } = useUser();
  useEffect(() => {
    if (email && !formData.email) {
      setFormData({ ...formData, email });
      setStep("otp");
      requestOtp();
    }
  }, [email]);

  const validations = {
    email: isValidEmail(formData.email),
    otp: formData.otp.length === 6,
    reset:
      formData.password.length >= 8 &&
      containsNumber(formData.password) &&
      containsSymbol(formData.password),
  };

  const [step, setStep] = React.useState<keyof typeof components>("email");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isValid = step !== "success" ? validations[step] : true;
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const requestOtp = async () => {
    setLoadingOtp(true);
    const { data } = await axiosInstance.post("/auth/otp/resend", {
      email: email ? email : formData.email,
    });
    setId(data.id);
    setLoadingOtp(false);
    setResend(false);
  };

  const verifyOtp = async () => {
    await axiosInstance.post("/auth/otp/verify", {
      email: formData.email,
      otp: formData.otp,
    });
  };

  const submitPassword = async () => {
    await axiosInstance.put(`users/${id}`, { password: formData.password });
  };

  const components = {
    email: (
      <View className=" space-y-4">
        <Image
          className="mx-auto"
          source={require("@/assets/images/forgot.png")}
        />
        <View className="space-y-2">
          <Text className="font-semibold text-base text-neutral-500">
            Please enter your email to reset the password
          </Text>
          <View>
            <Input
              placeholder="Email address"
              autoCapitalize="none"
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>
        </View>
      </View>
    ),
    otp: (
      <View className="space-y-14">
        <View className="space-y-2">
          <Text className="font-fwbold text-2xl text-center">Enter code</Text>
          <View>
            <Text className="font-main text-base  text-center text-neutral-500">
              Please enter the OTP sent to your email
            </Text>
            <Text className="font-fwbold text-center text-neutral-500">
              {formData.email}
            </Text>
          </View>
        </View>
        <View>
          <Input
            placeholder="- - - - - -"
            className={clsx([
              " text-2xl font-fwbold px-3 text-center py-1 rounded-xl lowercase",
            ])}
            keyboardType="number-pad"
            onChangeText={(text) => handleChange("otp", text)}
          />
          {resend && (
            <TouchableOpacity
              onPress={requestOtp}
              className={clsx([
                " h-10 flex-row space-x-2 my-2 items-center justify-center rounded-[40px]",
              ])}
            >
              <Text className="font-fwbold text-base  text-red-500">
                Resend OTP
              </Text>
              {loadingOtp && <ActivityIndicator size="small" />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    reset: (
      <View className="space-y-14">
        <View className="space-y-2">
          <Text className="font-fwbold text-2xl text-center">
            Create a new password
          </Text>
          <View>
            <Text className="font-main text-base  text-center text-neutral-500">
              Choose a new, unique password for security
            </Text>
          </View>
        </View>
        <View>
          <Input
            placeholder="••••••••"
            value={formData.password}
            textContentType="password"
            autoCapitalize="none"
            secureTextEntry
            onChangeText={(text) => handleChange("password", text)}
          />

          {formData?.password?.length > 0 && (
            <View className="space-y-2 mt-2">
              <Validation
                valid={formData.password?.length >= 8}
                text="Minimum 8 characters"
              />
              <Validation
                valid={containsNumber(formData.password)}
                text="At least 1 number"
              />
              <Validation
                valid={containsSymbol(formData.password)}
                text="At least 1 symbol"
              />
            </View>
          )}
        </View>
      </View>
    ),

    success: (
      <View className="space-y-16 mt-16">
        <View className="space-y-2">
          <Text className="font-fwbold text-xl text-dark text-center">
            Successful
          </Text>
          <View>
            <Text className="font-main text-base  text-center text-neutral-500">
              Congratulations! Your password has been changed. You can proceed
              to login
            </Text>
          </View>
        </View>
        <Image
          className="mx-auto"
          source={require("@/assets/images/success.png")}
        />
      </View>
    ),
  };

  const { navigate } = useRouter();

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === "email") {
        await requestOtp();
        setStep("otp");
      }
      if (step === "otp") {
        await verifyOtp();
        setStep("reset");
      }
      if (step === "reset") {
        await submitPassword();
        setStep("success");
      }
      if (step === "success") {
        await logOut();
        navigate("/Login");
      }
    } catch (error) {
      //@ts-ignore
      setError((error as ErrorObj).response?.data?.error ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    email: email ? "Update Password" : "Forgot Password",
    otp: "Check your email",
    reset: "Set a new password",
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
    }
    if (step === "reset") {
      setStep("otp");
    }
  };

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        setResend(true);
      }, 15000);
    }
  }, [resend, step]);

  const buttonText = {
    email: "Reset Password",
    otp: "Next",
    reset: "Next",
    success: "Login",
  };
  return (
    <SafeAreaView className="bg-purple-50 flex-1 px-4">
      <KeyboardAvoidingView
        className="flex-1 space-y-16"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {step !== "success" && (
          <View className="flex-row items-center py-2">
            <Back action={step !== "email" ? handleBack : undefined} />
            <Text className="font-main -ml-4 flex-1 text-center text-base text-dark">
              {titles[step]}
            </Text>
          </View>
        )}
        {error && <Message message={error} />}

        <View>{components[step]}</View>
        <TouchableOpacity
          disabled={!isValid}
          onPress={handleNext}
          className={clsx([
            "bg-dark h-[50] flex-row space-x-2 mt-4 items-center justify-center rounded-[40px]",
            !isValid && "bg-gray-500",
          ])}
        >
          <Text className="font-fwbold text-base text-white">
            {buttonText[step]}
          </Text>

          {loading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Forgot;
