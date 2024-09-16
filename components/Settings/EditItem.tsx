import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInputProps,
} from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { ErrorObj } from "@/types/global";
import Message from "../Core/Message";
import EditGender from "./EditGender";
import Input from "../Core/Input";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/Auth";
import { capitalize } from "@/utils";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const active = value.length > 0;
  const { user, mutate } = useUser();
  const { dismissModal } = useBottomSheetModal();

  const editItem = async (key: string, value: string) => {
    const label = key === "gender" ? "genderIdentity" : key;
    try {
      if (onChange) {
        onChange(label, value);
      } else {
        await axiosInstance.put(`/users/${user?._id}`, {
          [label]: value,
        });
        mutate();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await editItem(name, value);
      dismissModal();
    } catch (error) {
      console.error(error);
      setError(
        (error as ErrorObj).response.data.error ??
          `Failed to ${title.toLowerCase()}`
      );
    } finally {
      setLoading(false);
    }
  };

  const isGender = name === "genderIdentity";
  return (
    <View className={clsx(["   mt-2  px-4", isGender && "h-[80vh]"])}>
      <Text className="font-main text-xl font-bold text-center capitalize ">
        {title}
      </Text>
      <View className={clsx([isGender && "flex-1"])}>
        {error && <Message message={error} isError />}
        {name !== "genderIdentity" ? (
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
              defaultValue={val}
              placeholder={capitalize(name)}
              textContentType={name as TextInputProps["textContentType"]}
              secureTextEntry={name === "password"}
              autoFocus
              onChangeText={(text) => {
                error.length && setError("");
                setValue(text);
              }}
            />
          </View>
        ) : (
          <EditGender
            currentGender={value.length > 0 ? value : val}
            action={setValue}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={() => handleSubmit()}
        className={clsx([
          "flex-row space-x-2  w-full items-center h-12 justify-center rounded-full bg-purple-300",
          active && "bg-purple-500",
          isGender && "mb-14",
        ])}
      >
        <Text className="font-main text-base text-white font-semibold">
          Confirm
        </Text>
        {loading && <ActivityIndicator color="white" size="small" />}
      </TouchableOpacity>
    </View>
  );
};

export default EditItem;
