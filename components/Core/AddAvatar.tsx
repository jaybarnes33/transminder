import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const AddAvatar = () => {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <TouchableOpacity className="items-center" onPress={pickImage}>
      <View className="items-center flex-row gap-x-2">
        <FontAwesome6 name="camera" size={16} color="#a855f7" />
        <Text className="font-main text-base font-fwbold text-[#a855f7]">
          Add photo
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddAvatar;
