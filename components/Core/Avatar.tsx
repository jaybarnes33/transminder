import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image as Img,
} from "react-native";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUser } from "@/hooks/useUser";
import axiosInstance from "@/lib/axios";
import { mutate } from "swr";
import { decode } from "base64-arraybuffer";
import { Image } from "expo-image";
import { useSignUp } from "@/context/Signup";

const Avatar = ({
  size,
  name,
  image,
  isEdit = true,
  uploads = true,
  selectAction,
}: {
  size: string;
  name: string;
  image?: string;
  isEdit?: boolean;
  uploads?: boolean;
  selectAction?: (name: string, file: ImagePicker.ImagePickerAsset) => void;
}) => {
  const { user } = useUser();
  const [selected, setSelected] = useState<ImagePicker.ImagePickerAsset>();
  const [loading, setLoading] = useState(false);
  const { details } = useSignUp();
  const pickImage = async () => {
    if (selected) {
      if (uploads) {
        await updateImage();
      }

      return;
    } else {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelected(result.assets[0]);
        selectAction && selectAction("avatar", result.assets[0]);
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

      await axiosInstance.put(
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

  useEffect(() => {
    if (!uploads && details?.avatar) {
      setSelected(details.avatar);
    }
  }, []);
  return (
    <View className="gap-y-4">
      <View
        className={clsx([
          "h-14 w-14 rounded-full items-center justify-center",
          size === "xl" && "h-44 w-44",
          size === "lg" && "h-24 w-24",
          size === "md" && "h-20 w-20",
          size === "sm" && "h-8 w-8",
        ])}
      >
        {image || selected ? (
          <Img
            source={{ uri: selected?.uri ?? image }}
            style={{
              objectFit: "scale-down",
            }}
            className="absolute h-full w-full rounded-full border border-neutral-300"
          />
        ) : (
          <View className=" w-full h-full rounded-full items-center justify-center">
            <Img
              source={require("@/assets/images/avatar.png")}
              className="absolute  rounded-full"
            />

            <Text
              className={clsx([
                "text-white font-fwbold ",
                size === "xl" ? "text-[74px]" : "text-3xl",
              ])}
            >
              {name?.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {isEdit && (
        <View className="flex-row items-center justify-center gap-x-2">
          {selected && (
            <TouchableOpacity
              className="items-center justify-center flex-row gap-x-2"
              onPress={() => setSelected(undefined)}
            >
              <Text className="text-base font-fwbold text-red-500">Cancel</Text>
            </TouchableOpacity>
          )}
          {(!selected || (selected && uploads)) && (
            <TouchableOpacity
              className="items-center justify-center flex-row gap-x-2"
              onPress={pickImage}
            >
              {loading && <ActivityIndicator size="small" color="#a855f7" />}
              {!selected && (
                <FontAwesome6 name="camera" size={16} color="#a855f7" />
              )}
              <Text className="text-base font-fwbold text-[#a855f7]">
                {selected ? "Upload" : image ? "Edit Avatar" : "Add photo"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default Avatar;
