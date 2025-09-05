import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAudioPlayer } from "expo-audio";
import Emoji from "@/components/Core/Emoji";

interface AudioPlayerProps {
  uri: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, className }) => {
  try {
    const player = useAudioPlayer({ uri });

    return (
      <View
        className={
          className || "w-full h-full items-center justify-center bg-gray-200"
        }
      >
        <Emoji name="audio" />
        <TouchableOpacity
          onPress={() => {
            try {
              if (player.playing) {
                player.pause();
              } else {
                player.play();
              }
            } catch (error) {
              console.error("Error controlling audio:", error);
            }
          }}
          className="mt-2 bg-blue-500 rounded-full p-2"
        >
          <Text className="text-white text-xs">
            {player.playing ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } catch (error) {
    console.error("Error rendering audio:", error);
    return (
      <View className="w-full h-full items-center justify-center bg-gray-200">
        <Text className="text-gray-500">Audio Error</Text>
      </View>
    );
  }
};
