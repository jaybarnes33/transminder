import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface AudioRecorderProps {
  isRecording: boolean;
  onStopRecording: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  onStopRecording,
}) => {
  if (!isRecording) return null;

  return (
    <View className="absolute bottom-10 left-0 right-0 items-center">
      <TouchableOpacity
        onPress={onStopRecording}
        className="bg-red-500 rounded-full p-4"
      >
        <Text className="text-white font-bold">Stop Recording</Text>
      </TouchableOpacity>
    </View>
  );
};
