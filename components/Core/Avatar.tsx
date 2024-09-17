import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUser } from "@/hooks/useUser";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";
import { decode } from "base64-arraybuffer";
import { Image } from "expo-image";

const Avatar = ({
  size,
  name,
  image,
  isEdit = true,
}: {
  size: string;
  name: string;
  image?: string;
  isEdit?: boolean;
}) => {
  const { user } = useUser();
  const [selected, setSelected] = useState<ImagePicker.ImagePickerAsset>();
  const [loading, setLoading] = useState(false);
  const pickImage = async () => {
    if (selected) {
      await updateImage();
      return;
    } else {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelected(result.assets[0]);
      }
    }
  };

  const updateImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // @ts-ignore
      formData.append("avatar", {
        uri: selected?.uri,
        type: selected?.type,
        name: selected?.fileName,
      });

      const { data } = await axiosInstance.put(
        `/users/${user?._id}?user=${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSelected(undefined);
      mutate("/auth");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="space-y-4">
      <View
        className={clsx([
          "h-14 w-14 rounded-full items-center justify-center",
          size === "xl" && "h-44 w-44",
        ])}
      >
        {image || selected ? (
          <Image
            source={{ uri: selected?.uri ?? image }}
            style={{
              objectFit: "scale-down",
            }}
            className="absolute h-full w-full rounded-full border border-neutral-300"
          />
        ) : (
          <>
            <Image
              source={require("@/assets/images/avatar.png")}
              className="absolute h-full w-full rounded-full"
            />

            <Text
              className={clsx([
                "font-main text-white font-fwbold ",
                size === "xl" ? "text-[74px]" : "text-3xl",
              ])}
            >
              {name?.charAt(0)}
            </Text>
          </>
        )}
      </View>

      {isEdit && (
        <View className="flex-row items-center justify-center space-x-2">
          {selected && (
            <TouchableOpacity
              className="items-center justify-center flex-row space-x-2"
              onPress={() => setSelected(undefined)}
            >
              <Text className="font-main text-base font-fwbold text-red-500">
                Cancel
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="items-center justify-center flex-row space-x-2"
            onPress={pickImage}
          >
            {loading && <ActivityIndicator size="small" color="#a855f7" />}
            {!selected && (
              <FontAwesome6 name="camera" size={16} color="#a855f7" />
            )}
            <Text className="font-main text-base font-fwbold text-[#a855f7]">
              {selected ? "Upload" : image ? "Edit Avatar" : "Add photo"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Avatar;
