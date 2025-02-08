import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import Input from "../Core/Input";
import { useBottomSheetModal } from "@/context/BottomSheet";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";

const RenameAlbum = ({ name, id }: { name: string; id: string }) => {
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dismissModal } = useBottomSheetModal();
  const handleRename = async () => {
    if (name === albumName) {
      dismissModal;
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.put(`/albums/${id}`, {
        name: albumName,
      });
      await mutate(`/albums/${id}`);
    } catch (error) {
      console.log(error);
      setError("Failed to rename album");
    } finally {
      setLoading(false);
      dismissModal();
    }
  };
  return (
    <View className={clsx(["gap-y-1 mt-0 p-4"])}>
      <Text className="capitalize font-main text-xl font-bold text-center">
        Rename Album
      </Text>
      <Input
        placeholder={"Rename Album"}
        autoFocus
        defaultValue={name}
        onChangeText={(text) => setAlbumName(text)}
      />

      <TouchableOpacity
        onPress={handleRename}
        className="bg-black h-[40]  flex-row gap-x-1 items-center justify-center w-full rounded-md p-2"
      >
        <Text className="text-white">Rename</Text>
        {loading && <ActivityIndicator color="white" />}
      </TouchableOpacity>
    </View>
  );
};

export default RenameAlbum;
