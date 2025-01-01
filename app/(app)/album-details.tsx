import React, { useState, useRef, Fragment } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MoreVertical } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import useSWR from "swr";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import axiosInstance from "@/lib/axios";
import AlbumDetailSkeleton from "@/components/Gallery/DetailSkeleton";
import MediaAddDropdown from "@/components/Gallery/MediaAddDropdown";
import Emoji from "@/components/Core/Emoji";
import Back from "@/components/Core/Back";
import AlbumOptionsDropdown from "@/components/Gallery/AlbumOptions";

interface Album {
  _id: string;
  name: string;
  media: string[];
  createdAt: string;
  updatedAt: string;
}

interface UploadableFile {
  uri: string;
  type: string;
  name: string;
}

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function AlbumDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [selectedItems, setSelectedItems] = useState<UploadableFile[]>([]);
  const [uploadingItems, setUploadingItems] = useState<string[]>([]);

  const {
    data: album,
    error,
    isLoading,
    mutate,
  } = useSWR<Album>(id ? `/albums/${id}` : null, fetcher);

  const handleMediaOption = async (option: string) => {
    switch (option) {
      case "photo":
        await takePhoto();
        break;
      case "audio":
        await recordAudio();
        break;
      case "video":
        await recordVideo();
        break;
      case "gallery":
        await pickFromGallery();
        break;
      case "file":
        await pickFile();
        break;
    }
  };

  const takePhoto = async () => {
    if (permission?.granted) {
      setIsCameraOpen(true);
    } else {
      const newPermission = await requestPermission();
      if (newPermission.granted) {
        setIsCameraOpen(true);
      } else {
        alert("Sorry, we need camera permissions to make this work!");
      }
    }
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setIsCameraOpen(false);
        addSelectedItem({
          uri: photo?.uri!,
          type: "image/jpeg",
          name: "photo.jpg",
        });
      } catch (error) {
        console.error("Error capturing photo:", error);
        alert("Failed to capture photo. Please try again.");
      }
    }
  };

  const toggleCameraFacing = () => {
    setCameraType((current) => (current === "back" ? "front" : "back"));
  };

  const recordAudio = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need audio recording permissions to make this work!");
      return;
    }
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setIsRecording(false);
        if (uri) {
          addSelectedItem({
            uri,
            type: "audio/mp4",
            name: "audio.m4a",
          });
        }
      } catch (err) {
        console.error("Failed to stop recording", err);
      }
    }
  };

  const recordVideo = async () => {
    if (permission?.granted) {
      setIsCameraOpen(true);
    } else {
      const newPermission = await requestPermission();
      if (newPermission.granted) {
        setIsCameraOpen(true);
      } else {
        alert("Sorry, we need camera permissions to make this work!");
      }
    }
  };

  const handleVideoCapture = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        setIsCameraOpen(false);
        const video = await videoRecordPromise;
        if (video?.uri) {
          addSelectedItem({
            uri: video.uri,
            type: "video/mp4",
            name: "video.mp4",
          });
        }
      } catch (error) {
        console.error("Error recording video:", error);
        alert("Failed to record video. Please try again.");
      }
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        result.assets.forEach((asset) => {
          addSelectedItem({
            uri: asset.uri,
            type: asset.type === "image" ? "image/jpeg" : "video/mp4",
            name: asset.fileName || "media",
          });
        });
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
      alert("Failed to pick media from gallery. Please try again.");
    }
  };

  const pickFile = async () => {
    if (Platform.OS === "web") {
      alert("File picking is not supported on web");
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });
      if (result.output?.length) {
        result.output.forEach((file) => addSelectedItem(file));
      }
    } catch (error) {
      console.error("Error picking file:", error);
      alert("Failed to pick file. Please try again.");
    }
  };

  const addSelectedItem = (item: UploadableFile) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const uploadMedia = async () => {
    for (const item of selectedItems) {
      setUploadingItems((prev) => [...prev, item.uri]);
      try {
        const formData = new FormData();
        formData.append("file", item);
        formData.append("albumId", id);

        const response = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          mutate();
        }
      } catch (error) {
        console.error("Error uploading media:", error);
        alert(`Failed to upload ${item.name}. Please try again.`);
      } finally {
        setUploadingItems((prev) => prev.filter((uri) => uri !== item.uri));
      }
    }
    setSelectedItems([]);
  };

  if (isLoading) return <AlbumDetailSkeleton />;
  if (error) return <Text>Error loading album</Text>;
  if (!album) return null;

  const { name, media, createdAt } = album;

  const renderMediaItem = (url: string, isUploading: boolean = false) => {
    const fileExtension = url.split(".").pop()?.toLowerCase();
    const isAudio = ["mp3", "wav", "ogg"].includes(fileExtension || "");
    const isVideo = ["mp4", "mov", "avi"].includes(fileExtension || "");

    return (
      <View className="relative w-1/3 p-1 h-40">
        {isAudio ? (
          <View className="bg-gray-100 rounded-xl  items-center justify-center">
            <Emoji name="audio" />
          </View>
        ) : isVideo ? (
          <View className="relative">
            <Image
              source={{ uri: url }}
              className="w-full h-full rounded-xl bg-gray-100"
            />
            <View className="absolute bottom-2 right-2 bg-black/50 px-1.5 py-0.5 rounded">
              <Text className="text-white text-xs">Video</Text>
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: url }}
            className="w-full h-full rounded-xl bg-gray-100"
          />
        )}
        {isUploading && (
          <View className="absolute inset-0 bg-black/50 rounded-xl items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isCameraOpen ? (
        <View style={styles.container}>
          <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleCameraCapture}
              >
                <Text style={styles.text}>Capture</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <>
          <View className="px-4 py-2 flex-row items-center justify-between">
            <Back />
            <Text className="text-2xl font-fwbold">{name}</Text>
            <View className="flex-row justify-between gap-x-4">
              <TouchableOpacity>
                <Text className="text-gray-600 font-main">Select</Text>
              </TouchableOpacity>
              <View>
                <AlbumOptionsDropdown onSelect={console.log} />
              </View>
            </View>
          </View>

          <Text className="px-4 font-semibold text-gray-500 mb-4">
            {media.length} items • Created on{" "}
            {new Date(createdAt).toLocaleDateString()}
          </Text>

          <ScrollView className="flex-1 px-2">
            <View className="flex-row flex-wrap">
              {media.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => console.log("Open media", url)}
                >
                  {renderMediaItem(url)}
                </TouchableOpacity>
              ))}
              {selectedItems.map((item, index) => (
                <Fragment key={index}>
                  {renderMediaItem(item.uri, uploadingItems.includes(item.uri))}
                </Fragment>
              ))}
              <MediaAddDropdown onSelect={handleMediaOption} />
            </View>
          </ScrollView>

          {selectedItems.length > 0 && (
            <View className="absolute bottom-10 left-0 right-0 items-center">
              <TouchableOpacity
                onPress={uploadMedia}
                className="bg-blue-500 rounded-full p-4"
              >
                <Text className="text-white font-bold">
                  Upload {selectedItems.length} item
                  {selectedItems.length > 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isRecording && (
            <View className="absolute bottom-10 left-0 right-0 items-center">
              <TouchableOpacity
                onPress={stopRecording}
                className="bg-red-500 rounded-full p-4"
              >
                <Text className="text-white font-bold">Stop Recording</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
