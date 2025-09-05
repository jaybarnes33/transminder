import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { VideoPlayer } from "./VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";
import { getImage } from "@/utils";

interface MediaItem {
  file: string;
  date: string;
}

interface UploadableFile {
  uri: string;
  type: string;
  name: string;
}

interface MediaGridProps {
  media: MediaItem[];
  selectedItems: UploadableFile[];
  uploadingItems: string[];
  onMediaPress: (index: number) => void;
  children?: React.ReactNode; // For the MediaAddDropdown
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  selectedItems,
  uploadingItems,
  onMediaPress,
  children,
}) => {
  const renderMediaItem = (url: string, isUploading = false) => {
    try {
      if (!url) return null;

      let processedUrl = url;
      if (!url.startsWith("file")) {
        processedUrl = getImage(url);
      }

      const fileExtension = processedUrl.split(".").pop()?.toLowerCase();
      const isAudio = ["mp3", "wav", "ogg", "m4a"].includes(
        fileExtension || ""
      );
      const isVideo = ["mp4", "mov", "avi"].includes(fileExtension || "");

      return (
        <View className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
          {isAudio ? (
            <AudioPlayer uri={processedUrl} />
          ) : isVideo ? (
            <View className="w-full h-full relative">
              <VideoPlayer uri={processedUrl} />
              <View className="absolute bottom-2 right-2 bg-black/50 px-1.5 py-0.5 rounded">
                <Text className="text-white text-xs">Video</Text>
              </View>
            </View>
          ) : (
            <Image
              source={{ uri: processedUrl }}
              className="w-full h-full"
              resizeMode="cover"
              onError={(error) => {
                console.error("Error loading image:", error);
              }}
            />
          )}
          {isUploading && (
            <View className="absolute inset-0 justify-center items-center bg-black/50 w-full h-full">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
        </View>
      );
    } catch (error) {
      console.error("Error rendering media item:", error);
      return (
        <View className="w-full h-full bg-gray-100 rounded-xl items-center justify-center">
          <Text className="text-gray-500">Media Error</Text>
        </View>
      );
    }
  };

  return (
    <View className="items-center justify-center">
      <View className="flex-row flex-wrap  items-center  gap-3 p-2">
        {media &&
          media.length > 0 &&
          media.map((item, index) => (
            <TouchableOpacity
              className="w-[30%] h-32"
              key={`media-${index}`}
              onPress={() => onMediaPress(index)}
            >
              {renderMediaItem(item?.file)}
            </TouchableOpacity>
          ))}
        {selectedItems.length > 0 &&
          selectedItems.map((item, index) => (
            <View key={`selected-${index}`} className="w-[30%] h-32">
              {renderMediaItem(item.uri, uploadingItems.includes(item.uri))}
            </View>
          ))}
        <View className="w-[30%] h-32">{children}</View>
      </View>
    </View>
  );
};
