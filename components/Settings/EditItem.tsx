import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import { useBottomSheetModal } from "@/context/BottomSheet";
import { ErrorObj } from "@/types/global";
import Message from "../Core/Message";
import EditGender from "./EditGender";
import Input from "../Core/Input";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/Auth";

import { setUser } from "@/utils/auth";

const EditItem = ({
  name,
  title,
  val,
}: {
  name: string;
  title: string;
  val: string;
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const active = value.length > 0;
  const { user, setUser } = useUser();
  const { dismissModal } = useBottomSheetModal();

  const editItem = async (key: string, value: string) => {
    try {
      console.log("key", key);
      const { data } = await axiosInstance.put(`/users/${user?._id}`, {
        [key === "gender" ? "genderIdentity" : key]: value,
      });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await editItem(name, value);
      dismissModal();
    } catch (error) {
      console.log(error);
      setError(
        (error as ErrorObj).response.data.error ??
          `Failed to ${title.toLowerCase()}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className=" mt-2  px-4">
      <Text className="font-main text-xl font-bold text-center ">{title}</Text>
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
            placeholder="Name"
            textContentType="name"
            autoFocus
            onChangeText={(text) => {
              error.length && setError("");
              setValue(text);
            }}
          />
        </View>
      ) : (
        <EditGender currentGender={value} action={setValue} />
      )}

      <TouchableOpacity
        onPress={() => handleSubmit()}
        className={clsx([
          "flex-row space-x-2 w-full items-center h-12 justify-center rounded-full bg-purple-300",
          active && "bg-purple-500",
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
