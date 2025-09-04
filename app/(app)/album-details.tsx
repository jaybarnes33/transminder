import { useState, useRef, useCallback } from "react";
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
  Share,
} from "react-native";
import { mutate as mutateSWR } from "swr";
import { useRouter, useLocalSearchParams } from "expo-router";
import useSWR from "swr";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import {
  Modal,
  Button,
  Portal,
  Provider as PaperProvider,
} from "react-native-paper";

import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import axiosInstance from "@/lib/axios";
import AlbumDetailSkeleton from "@/components/Gallery/DetailSkeleton";
import MediaAddDropdownModern from "@/components/Gallery/MediaAddDropdownModern";
import Emoji from "@/components/Core/Emoji";
import Back from "@/components/Core/Back";
import AlbumOptionsDropdownModern from "@/components/Gallery/AlbumOptionsModern";
import { getImage } from "@/utils";
import { useBottomSheetModal } from "@/context/BottomSheet";
import RenameAlbum from "@/components/Gallery/RenameAlbum";
import MediaViewer from "@/components/Gallery/MediaViewer";

interface Album {
  _id: string;
  name: string;
  media: { file: string; date: string }[];
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
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  const [showDeleteMediaConfirmation, setShowDeleteMediaConfirmation] =
    useState(false);
  const [mediaToDeleteIndex, setMediaToDeleteIndex] = useState<number | null>(
    null
  );

  const { navigate } = useRouter();
  const {
    data: album,
    error,
    isLoading,
    mutate,
  } = useSWR<Album>(id ? `/albums/${id}` : null, fetcher);

  const { showModal } = useBottomSheetModal();

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

  const renameAlbum = async () => {
    showModal(<RenameAlbum name={album?.name!} id={id} />);
  };

  const deleteAlbum = async () => {
    console.log("Delete attempt", { showConfirmDelete });

    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    try {
      setLoadingDelete(true);
      await axiosInstance.delete(`/albums/${id}`);
      await mutateSWR("/albums");
      navigate("/gallery");
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album. Please try again.");
    } finally {
      setLoadingDelete(false);
      setShowConfirmDelete(false);
    }
  };

  const handleAlbumOption = (option: string) => {
    console.log("Album option selected:", option);
    switch (option) {
      case "rename":
        renameAlbum();
        break;
      case "delete":
        deleteAlbum();
        break;
      default:
        handleMediaOption(option);
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
    if (!cameraRef.current) return;

    if (!isRecordingVideo) {
      try {
        setIsRecordingVideo(true);
        const video = await cameraRef.current.recordAsync();
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
    } else {
      try {
        await cameraRef.current.stopRecording();
        setIsRecordingVideo(false);
        setIsCameraOpen(false);
      } catch (error) {
        console.error("Error stopping video recording:", error);
        alert("Failed to stop recording. Please try again.");
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
        Array.from(result.output).forEach((file) =>
          addSelectedItem(file as File & { uri: string })
        );
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
    try {
      const formData = new FormData();

      selectedItems.forEach((item, index) => {
        const fileExtension = item.uri.split(".").pop();
        const fileName = `file${index}.${fileExtension}`;

        //@ts-ignore
        formData.append("files", {
          uri: item.uri,
          type: item.type,
          name: fileName,
        });
      });

      setUploadingItems(selectedItems.map((item) => item.uri));
      console.log("Uploading to server...");

      const response = await axiosInstance.post(
        `/upload?album=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        }
      );

      if (response.data.files && Array.isArray(response.data.files)) {
        await axiosInstance.put(`/albums/${id}`, {
          media: [
            ...album?.media!,
            ...response.data.files.map((file: string) => ({
              file: file,
              date: new Date().toISOString(),
            })),
          ],
        });

        await mutate();

        setSelectedItems([]);
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media. Please try again.");
    } finally {
      setUploadingItems([]);
    }
  };

  const handleOpenMedia = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleCloseMedia = () => {
    setSelectedMediaIndex(null);
  };

  const handleNavigateToMedia = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleShareMedia = async (url: string) => {
    try {
      const shareUrl = getImage(url);
      await Share.share({
        url: shareUrl,
        message: `Check out this media from ${album?.name}!`,
      });
    } catch (error) {
      console.error("Error sharing media:", error);
      alert("Failed to share media. Please try again.");
    }
  };

  const handleDeleteMedia = useCallback(
    (index: number) => {
      setMediaToDeleteIndex(index);
      setShowDeleteMediaConfirmation(true);
    },
    [setMediaToDeleteIndex, setShowDeleteMediaConfirmation]
  );

  const confirmDeleteMedia = useCallback(async () => {
    if (mediaToDeleteIndex === null) return;

    try {
      setLoadingDelete(true);
      const fileToDelete = album?.media[mediaToDeleteIndex];
      await axiosInstance.post(`/albums/${id}/media`, {
        files: [fileToDelete?.file],
      });

      // Update selectedMediaIndex
      if (album?.media.length === 1) {
        // If this was the last item, set to null
        setSelectedMediaIndex(null);
      } else if (mediaToDeleteIndex < album?.media.length! - 1) {
        // If there are more items after this one, move to the next
        setSelectedMediaIndex(mediaToDeleteIndex);
      } else {
        // If this was the last item but not the only one, move to the previous
        setSelectedMediaIndex(mediaToDeleteIndex - 1);
      }
      await mutate();
      await mutateSWR("/albums");
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media. Please try again.");
    } finally {
      setShowDeleteMediaConfirmation(false);
      setMediaToDeleteIndex(null);
      setLoadingDelete(false);
    }
  }, [id, album?.media, mediaToDeleteIndex, mutate, setSelectedMediaIndex]);
  const cancelDeleteMedia = useCallback(() => {
    setShowDeleteMediaConfirmation(false);
    setMediaToDeleteIndex(null);
  }, []);

  if (isLoading) return <AlbumDetailSkeleton />;
  if (error) return <Text>Error loading album</Text>;
  if (!album) return null;

  const { name, media, createdAt } = album;

  const renderMediaItem = (url: string, isUploading = false) => {
    if (!url?.startsWith("file")) {
      url = getImage(url);
    }
    const fileExtension = url.split(".").pop()?.toLowerCase();
    const isAudio = ["mp3", "wav", "ogg", "m4a"].includes(fileExtension || "");
    const isVideo = ["mp4", "mov", "avi"].includes(fileExtension || "");

    return (
      <View className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {isAudio ? (
          <View className="w-full h-full items-center justify-center">
            <Emoji name="audio" />
          </View>
        ) : isVideo ? (
          <View className="w-full h-full relative">
            <Image
              source={{ uri: url }}
              className="w-full h-full"
              style={{ aspectRatio: 1 }}
            />
            <View className="absolute bottom-2 right-2 bg-black/50 px-1.5 py-0.5 rounded">
              <Text className="text-white text-xs">Video</Text>
            </View>
          </View>
        ) : (
          <Image
            source={{ uri: url }}
            className="w-full h-full"
            style={{ aspectRatio: 1 }}
            resizeMode="cover"
          />
        )}
        {isUploading && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <PaperProvider>
      <SafeAreaView className="flex-1 bg-white">
        {isCameraOpen ? (
          <View style={styles.container}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
            >
              <SafeAreaView className="flex-1">
                <View className="flex-row justify-between px-4 py-2">
                  <TouchableOpacity onPress={() => setIsCameraOpen(false)}>
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
        ) : (
          <View className="flex-1">
            <View
              className="px-4 py-2 flex-row items-center justify-between"
              style={{
                zIndex: 999998,
                elevation: 999998,
              }}
            >
              <Back />
              <Text className="text-2xl font-fwbold">{name}</Text>
              <View className="flex-row justify-between gap-x-4">
                <View
                  style={{
                    zIndex: 999999,
                    elevation: 999999,
                  }}
                >
                  <AlbumOptionsDropdownModern onSelect={handleAlbumOption} />
                </View>
              </View>
            </View>

            <Text className="px-4 font-semibold text-gray-500 mb-4">
              {media.length} items • Created on{" "}
              {new Date(createdAt).toLocaleDateString()}
            </Text>

            <ScrollView
              className="flex-1"
              style={{
                zIndex: 1,
                elevation: 1,
              }}
            >
              <View className="flex-row  flex-wrap w-full">
                {media &&
                  media.length > 0 &&
                  media.map((item, index) => (
                    <TouchableOpacity
                      className="w-[33.33%] "
                      key={`media-${index}`}
                      onPress={() => handleOpenMedia(index)}
                    >
                      <View className="p-1">{renderMediaItem(item?.file)}</View>
                    </TouchableOpacity>
                  ))}
                {selectedItems.length > 0 &&
                  selectedItems.map((item, index) => (
                    <View key={`selected-${index}`} className="w-[33.33%] ">
                      <View className="p-1">
                        {renderMediaItem(
                          item.uri,
                          uploadingItems.includes(item.uri)
                        )}
                      </View>
                    </View>
                  ))}
                <View className="w-[33.33%] px-1">
                  <MediaAddDropdownModern onSelect={handleMediaOption} />
                </View>
              </View>
            </ScrollView>

            {(media.length > 0 || selectedItems.length > 0) && (
              <MediaViewer
                album={album.name}
                onDismiss={cancelDeleteMedia}
                onConfirm={confirmDeleteMedia}
                loading={loadingDelete}
                showDelete={showDeleteMediaConfirmation}
                isVisible={selectedMediaIndex !== null}
                onClose={handleCloseMedia}
                currentIndex={selectedMediaIndex || 0}
                mediaItems={
                  selectedItems.length > 0
                    ? [
                        ...media,
                        ...selectedItems.map((file) => ({
                          file: file.uri,
                          date: new Date().toISOString(),
                        })),
                      ]
                    : [...media]
                }
                onNavigate={handleNavigateToMedia}
                onShare={handleShareMedia}
                onDelete={handleDeleteMedia}
              />
            )}
            {selectedItems.length > 0 && (
              <View className="absolute bottom-10 z-[99999] left-0 right-0 items-center">
                <TouchableOpacity
                  onPress={uploadMedia}
                  className="bg-blue-500 rounded-full p-4 "
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

            {showConfirmDelete && (
              <View className="absolute bottom-10 left-0 right-0 items-center z-50">
                <TouchableOpacity
                  onPress={() => deleteAlbum()}
                  className="items-center px-5 py-1 bg-red-100 flex-row rounded-full"
                  disabled={loadingDelete}
                >
                  <Text className="text-base font-semibold text-red-500">
                    Delete
                  </Text>
                  {loadingDelete && (
                    <ActivityIndicator color="#EF4444" className="ml-2" />
                  )}
                </TouchableOpacity>

                <Text className="text-red-400 font-semibold mt-2 text-center px-4">
                  Deleting is irreversible, Press the delete button again to
                  confirm
                </Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
});
