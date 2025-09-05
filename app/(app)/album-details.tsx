import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  Share,
} from "react-native";
import { mutate as mutateSWR } from "swr";
import { useRouter, useLocalSearchParams } from "expo-router";
import useSWR from "swr";
import * as ImagePicker from "expo-image-picker";
// import {
//   useAudioRecorder,
//   useAudioRecorderState,
//   requestRecordingPermissionsAsync,
//   setAudioModeAsync,
// } from "expo-audio";
import { Provider as PaperProvider } from "react-native-paper";

import { useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import axiosInstance from "@/lib/axios";
import AlbumDetailSkeleton from "@/components/Gallery/DetailSkeleton";
import MediaAddDropdownModern from "@/components/Gallery/MediaAddDropdownModern";
import { getImage } from "@/utils";
import { useBottomSheetModal } from "@/context/BottomSheet";
import RenameAlbum from "@/components/Gallery/RenameAlbum";
import MediaViewer from "@/components/Gallery/MediaViewer";

// Import new components
import {
  CameraCapture,
  MediaGrid,
  AlbumHeader,
  MediaUpload,
  AudioRecorder,
  DeleteConfirmation,
} from "@/components/Gallery";

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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [selectedItems, setSelectedItems] = useState<UploadableFile[]>([]);
  const [uploadingItems, setUploadingItems] = useState<string[]>([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const [showDeleteMediaConfirmation, setShowDeleteMediaConfirmation] =
    useState(false);
  const [mediaToDeleteIndex, setMediaToDeleteIndex] = useState<number | null>(
    null
  );

  const { navigate } = useRouter();

  const [albumId, setAlbumId] = useState<string | null>(id as string);

  const {
    data: album,
    error,
    isLoading,
    mutate,
  } = useSWR<Album>(albumId ? `/albums/${albumId}` : null, fetcher);

  // Debug camera permissions
  useEffect(() => {
    console.log("Camera permission status:", permission);
  }, [permission]);

  // Configure audio session on component mount - wrap in try-catch
  // useEffect(() => {
  //   const configureAudioSession = async () => {
  //     try {
  //       await setAudioModeAsync({
  //         allowsRecording: true,
  //         playsInSilentMode: true,
  //         shouldPlayInBackground: false,
  //         shouldRouteThroughEarpiece: false,
  //         interruptionMode: "duckOthers",
  //       });
  //     } catch (error) {
  //       console.error("Failed to configure audio session:", error);
  //     }
  //   };

  //   configureAudioSession();
  // }, []);

  // Initialize audio recorder and state at the top level
  // const audioRecorder = useAudioRecorder({
  //   extension: ".m4a",
  //   sampleRate: 44100,
  //   numberOfChannels: 1,
  //   bitRate: 128000,
  //   android: {
  //     extension: ".m4a",
  //     outputFormat: "mpeg4",
  //     audioEncoder: "aac",
  //     sampleRate: 44100,
  //   },
  //   ios: {
  //     extension: ".m4a",
  //     outputFormat: "mpeg4aac",
  //     audioQuality: 96,
  //     sampleRate: 44100,
  //     linearPCMBitDepth: 16,
  //     linearPCMIsBigEndian: false,
  //     linearPCMIsFloat: false,
  //   },
  // });

  // const recorderState = useAudioRecorderState(audioRecorder);

  const { showModal } = useBottomSheetModal();

  // Early return if no album ID
  if (!albumId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Invalid album ID</Text>
      </SafeAreaView>
    );
  }

  const handleMediaOption = async (option: string) => {
    try {
      switch (option) {
        case "photo":
          await takePhoto();
          break;
          // case "audio":
          //   await recordAudio();
          //   break;
          // case "video":
          //   await recordVideo();
          break;
        case "gallery":
          await pickFromGallery();
          break;
        case "file":
          await pickFile();
          break;
      }
    } catch (error) {
      console.error("Error handling media option:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const renameAlbum = async () => {
    try {
      if (album?.name && albumId) {
        showModal(<RenameAlbum name={album.name} id={albumId} />);
      }
    } catch (error) {
      console.error("Error showing rename modal:", error);
    }
  };

  const deleteAlbum = async () => {
    console.log("Delete attempt", { showConfirmDelete });

    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    try {
      setLoadingDelete(true);
      await axiosInstance.delete(`/albums/${albumId}`);
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
    try {
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
    } catch (error) {
      console.error("Error handling album option:", error);
    }
  };

  const takePhoto = async () => {
    try {
      setCameraLoading(true);
      if (!permission?.granted) {
        const newPermission = await requestPermission();
        if (!newPermission.granted) {
          alert("Sorry, we need camera permissions to make this work!");
          setCameraLoading(false);
          return;
        }
      }
      setIsCameraOpen(true);
      setTimeout(() => setCameraLoading(false), 1000);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      alert("Failed to request camera permission. Please try again.");
      setCameraLoading(false);
    }
  };

  const handleCapturePhoto = (file: UploadableFile) => {
    addSelectedItem(file);
  };

  const handleCaptureVideo = (file: UploadableFile) => {
    addSelectedItem(file);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  // const recordAudio = async () => {
  //   try {
  //     const { status } = await requestRecordingPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("Sorry, we need audio recording permissions to make this work!");
  //       return;
  //     }

  //     await setAudioModeAsync({
  //       allowsRecording: true,
  //       playsInSilentMode: true,
  //       shouldPlayInBackground: false,
  //       shouldRouteThroughEarpiece: false,
  //       interruptionMode: "duckOthers",
  //     });

  //     await audioRecorder.prepareToRecordAsync();
  //     audioRecorder.record();
  //     setIsRecording(true);
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //     alert("Failed to start recording. Please try again.");
  //   }
  // };

  // const stopRecording = async () => {
  //   try {
  //     await audioRecorder.stop();
  //     setIsRecording(false);

  //     setTimeout(() => {
  //       if (recorderState.url) {
  //         addSelectedItem({
  //           uri: recorderState.url,
  //           type: "audio/m4a",
  //           name: "audio.m4a",
  //         });
  //       }
  //     }, 100);
  //   } catch (err) {
  //     console.error("Failed to stop recording", err);
  //     alert("Failed to stop recording. Please try again.");
  //   }
  // };

  // const recordVideo = async () => {
  //   try {
  //     setCameraLoading(true);
  //     if (!permission?.granted) {
  //       const newPermission = await requestPermission();
  //       if (!newPermission.granted) {
  //         alert("Sorry, we need camera permissions to make this work!");
  //         setCameraLoading(false);
  //         return;
  //       }
  //     }
  //     setIsCameraOpen(true);
  //     setTimeout(() => setCameraLoading(false), 1000);
  //   } catch (error) {
  //     console.error("Error requesting camera permission:", error);
  //     alert("Failed to request camera permission. Please try again.");
  //     setCameraLoading(false);
  //   }
  // };

  const pickFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

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
        `/upload?album=${albumId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        }
      );

      if (response.data.files && Array.isArray(response.data.files)) {
        await axiosInstance.put(`/albums/${albumId}`, {
          media: [
            ...(album?.media || []),
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

  const handleDeleteMedia = useCallback((index: number) => {
    setMediaToDeleteIndex(index);
    setShowDeleteMediaConfirmation(true);
  }, []);

  const confirmDeleteMedia = useCallback(async () => {
    if (mediaToDeleteIndex === null || !album) return;

    try {
      setLoadingDelete(true);
      const fileToDelete = album.media[mediaToDeleteIndex];
      await axiosInstance.post(`/albums/${albumId}/media`, {
        files: [fileToDelete?.file],
      });

      if (album.media.length === 1) {
        setSelectedMediaIndex(null);
      } else if (mediaToDeleteIndex < album.media.length - 1) {
        setSelectedMediaIndex(mediaToDeleteIndex);
      } else {
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
  }, [albumId, album, mediaToDeleteIndex, mutate]);

  const cancelDeleteMedia = useCallback(() => {
    setShowDeleteMediaConfirmation(false);
    setMediaToDeleteIndex(null);
  }, []);

  if (isLoading) return <AlbumDetailSkeleton />;
  if (error) return <Text>Error loading album</Text>;
  if (!album) return null;

  const { name, media, createdAt } = album;

  return (
    <PaperProvider>
      <SafeAreaView className="flex-1 bg-white">
        <CameraCapture
          isOpen={isCameraOpen}
          onClose={handleCloseCamera}
          onCapturePhoto={handleCapturePhoto}
          onCaptureVideo={handleCaptureVideo}
        />

        {!isCameraOpen && (
          <View className="flex-1">
            <AlbumHeader
              name={name}
              mediaCount={media?.length || 0}
              createdAt={createdAt}
              onAlbumOption={handleAlbumOption}
            />

            <ScrollView
              className="flex-1"
              style={{
                zIndex: 1,
                elevation: 1,
              }}
            >
              <MediaGrid
                media={media || []}
                selectedItems={selectedItems}
                uploadingItems={uploadingItems}
                onMediaPress={handleOpenMedia}
              >
                <MediaAddDropdownModern onSelect={handleMediaOption} />
              </MediaGrid>
            </ScrollView>

            {(media?.length > 0 || selectedItems.length > 0) && (
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
                        ...(media || []),
                        ...selectedItems.map((file) => ({
                          file: file.uri,
                          date: new Date().toISOString(),
                        })),
                      ]
                    : [...(media || [])]
                }
                onNavigate={handleNavigateToMedia}
                onShare={handleShareMedia}
                onDelete={handleDeleteMedia}
              />
            )}

            <MediaUpload selectedItems={selectedItems} onUpload={uploadMedia} />

            {/* <AudioRecorder
              isRecording={isRecording}
              onStopRecording={stopRecording}
            /> */}

            <DeleteConfirmation
              visible={showConfirmDelete}
              loading={loadingDelete}
              onConfirm={deleteAlbum}
            />
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}
