import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView, type CameraType } from "expo-camera";

interface UploadableFile {
  uri: string;
  type: string;
  name: string;
}

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapturePhoto: (file: UploadableFile) => void;
  onCaptureVideo: (file: UploadableFile) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onCapturePhoto,
  onCaptureVideo,
}) => {
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const toggleCameraFacing = () => {
    setCameraType((current) => (current === "back" ? "front" : "back"));
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        onClose();
        if (photo?.uri) {
          onCapturePhoto({
            uri: photo.uri,
            type: "image/jpeg",
            name: "photo.jpg",
          });
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
        alert("Failed to capture photo. Please try again.");
      }
    }
  };

  const handleVideoCapture = async () => {
    if (!cameraRef.current) return;

    if (!isRecordingVideo) {
      try {
        setIsRecordingVideo(true);
        const video = await cameraRef.current.recordAsync();
        if (video?.uri) {
          onCaptureVideo({
            uri: video.uri,
            type: "video/mp4",
            name: "video.mp4",
          });
        }
      } catch (error) {
        console.error("Error recording video:", error);
        alert("Failed to record video. Please try again.");
        setIsRecordingVideo(false);
      }
    } else {
      try {
        await cameraRef.current.stopRecording();
        setIsRecordingVideo(false);
        onClose();
      } catch (error) {
        console.error("Error stopping video recording:", error);
        alert("Failed to stop recording. Please try again.");
        setIsRecordingVideo(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        mode="picture"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-row justify-between px-4 py-2">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-white font-main">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Text className="text-white font-main">Flip</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-end pb-10">
            {isRecordingVideo ? (
              <View className="items-center">
                <TouchableOpacity
                  onPress={handleVideoCapture}
                  className="bg-red-500 rounded-full w-16 h-16 items-center justify-center"
                >
                  <View className="bg-white rounded w-6 h-6" />
                </TouchableOpacity>
                <Text className="text-white mt-2">Recording...</Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center gap-x-10">
                <TouchableOpacity
                  onPress={handleCameraCapture}
                  className="bg-white rounded-full w-16 h-16 items-center justify-center"
                >
                  <View className="bg-black rounded-full w-14 h-14" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsRecordingVideo(true);
                    handleVideoCapture();
                  }}
                  className="bg-white rounded-full w-16 h-16 items-center justify-center"
                >
                  <View className="bg-red-500 rounded-full w-14 h-14" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
