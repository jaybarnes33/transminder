import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInputProps,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { ErrorObj } from "@/types/global";
import Message from "../Core/Message";
import EditGender from "./EditGender";
import Input from "../Core/Input";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/Auth";
import { capitalize } from "@/utils";
import Countries from "../Core/Countries";
import Back from "../Core/Back";
import { useRouter } from "expo-router";
import { logout } from "@/utils/auth";

const EditItem = ({
  name,
  title,
  val,
  onChange,
}: {
  name: string;
  title: string;
  val: string;
  onChange?: (key: string, value: string) => void;
}) => {
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const active = value.length > 0;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { user, mutate } = useUser();
  const { dismissModal } = useBottomSheetModal();
  const { navigate } = useRouter();

  const verifyPassword = async (val: string) => {
    const endpoint = user?.googleId
      ? `/auth/verify?provider=google`
      : `/auth/verify`;
    const data = user?.googleId ? { otp: val } : { password: val };
    await axiosInstance.post(endpoint, data);
  };

  const editItem = async (key: string, value: string) => {
    const label = key === "gender" ? "genderIdentity" : key;
    try {
      if (onChange) {
        onChange(label, value);
      } else {
        const data = { [label]: value };
        await axiosInstance.put(`/users/${user?._id}`, data);
        if (key === "email") {
          await logout();
          mutate(undefined, false);
          navigate({
            pathname: "/Success",
            params: {
              message: `Congratulations! Your email has been changed to ${value}. Please login with your new email`,
            },
          });
        }
        mutate();
      }
    } catch (error) {
      setError(
        (error as ErrorObj).response?.data?.error ??
          `Failed to update ${key.toLowerCase()}`
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (name === "email" && step === 1) {
        if (user?.googleId) {
          // Send OTP to user's email
          await axiosInstance.post("/auth/otp/resend", { email: user.email });
        }
        setStep(2);
        setLoading(false);
        return;
      }
      if (name === "email" && step === 2) {
        if (user?.googleId) {
          // Handle OTP verification
          await verifyPassword(otp);
        } else {
          await verifyPassword(password);
        }
      }
      await editItem(name, value);
      setIsSubmitted(true);
    } catch (error) {
      setError(
        (error as ErrorObj).response?.data?.error ??
          `Failed to ${title.toLowerCase()}`
      );
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitted && !error) {
      dismissModal();
      Keyboard.dismiss();
    }
  }, [isSubmitted, error, dismissModal]);

  const isGender = name === "genderIdentity";
  const isAgeEror =
    name === "age" && (parseInt(value) < 18 || parseInt(value) > 100);

  return (
    <View className={clsx(["   mt-5  px-4"])}>
      <View className="flex-row items-center space-x-2">
        {step === 2 && <Back action={() => setStep(1)} />}
        <Text className=" text-xl flex-1  font-fwbold text-center capitalize ">
          {step === 1
            ? title
            : user?.googleId
            ? "Enter OTP to confirm"
            : "Enter password to confirm"}
        </Text>
      </View>
      <View>
        {error && <Message message={error} isError />}
        {step === 1 ? (
          name !== "genderIdentity" ? (
            name !== "country" ? (
              <View
                className={clsx([
                  "space-y-1 mt-0",
                  error.length > 0 ? "mb-3" : "my-3",
                ])}
              >
                <Text className="capitalize font-main text-base font-semibold">
                  {name}
                </Text>

                <Input
                  key={name + step}
                  defaultValue={val}
                  placeholder={capitalize(name)}
                  textContentType={name as TextInputProps["textContentType"]}
                  secureTextEntry={name === "password"}
                  autoFocus
                  onChangeText={(text) => {
                    error.length && setError("");
                    setValue(text);
                  }}
                  keyboardType={name === "age" ? "numeric" : "default"}
                />
                {isAgeEror && (
                  <Text className="text-red-500 text-sm font-main">
                    Age must be between 18 and 100
                  </Text>
                )}
              </View>
            ) : (
              <Countries current={val} onSelect={setValue} />
            )
          ) : (
            <EditGender
              currentGender={value.length > 0 ? value : val}
              action={setValue}
            />
          )
        ) : (
          <View
            className={clsx([
              "space-y-1 mt-0",
              error.length > 0 ? "mb-3" : "my-3",
            ])}
          >
            <Text className="capitalize font-main text-base font-semibold">
              {user?.googleId ? "OTP" : "Password"}
            </Text>
            <Input
              key={name + step}
              placeholder={user?.googleId ? "OTP" : "Password"}
              textContentType={user?.googleId ? "oneTimeCode" : "password"}
              secureTextEntry={!user?.googleId}
              autoFocus
              onChangeText={(text) => {
                error.length && setError("");
                user?.googleId ? setOtp(text) : setPassword(text);
              }}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => handleSubmit()}
        className={clsx([
          "flex-row space-x-2  w-full items-center h-12 justify-center rounded-full bg-purple-300",
          active && "bg-purple-500",
          isAgeEror && "bg-purple-300",
          isGender && "mb-14",
        ])}
        disabled={!active || isAgeEror}
      >
        <Text className="font-main text-base text-white font-semibold">
          {step === 1 ? "Next" : "Confirm"}
        </Text>
        {loading && <ActivityIndicator color="white" size="small" />}
      </TouchableOpacity>
    </View>
  );
};

export default EditItem;
