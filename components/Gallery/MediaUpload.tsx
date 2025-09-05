import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface UploadableFile {
  uri: string;
  type: string;
  name: string;
}

interface MediaUploadProps {
  selectedItems: UploadableFile[];
  onUpload: () => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  selectedItems,
  onUpload,
}) => {
  if (selectedItems.length === 0) return null;

  return (
    <View className="absolute bottom-10 z-[99999] left-0 right-0 items-center">
      <TouchableOpacity
        onPress={onUpload}
        className="bg-blue-500 rounded-full p-4"
      >
        <Text className="text-white font-bold">
          Upload {selectedItems.length} item
          {selectedItems.length > 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
