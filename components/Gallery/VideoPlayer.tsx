import React from "react";
import { View, Text } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

interface VideoPlayerProps {
  uri: string;
  className?: string;
  style?: any;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  className,
  style,
}) => {
  try {
    const player = useVideoPlayer({ uri });
    return (
      <VideoView
        player={player}
        className={className || "w-full h-full"}
        style={style || { aspectRatio: 1 }}
      />
    );
  } catch (error) {
    console.error("Error rendering video:", error);
    return (
      <View className="w-full h-full items-center justify-center bg-gray-200">
        <Text className="text-gray-500">Video Error</Text>
      </View>
    );
  }
};
