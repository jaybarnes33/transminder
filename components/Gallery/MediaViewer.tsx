"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Share,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";

import { getImage } from "@/utils";
import Back from "@/components/Core/Back";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import clsx from "clsx";

interface MediaItem {
  file: string;
  date: string;
}

interface MediaViewerProps {
  isVisible: boolean;
  onClose: () => void;
  currentIndex: number;
  loading: boolean;
  album: string;
  showDelete: boolean;
  mediaItems: MediaItem[];
  onNavigate: (index: number) => void;
  onDismiss: () => void;
  onShare?: (url: string) => void;
  onDelete: (index: number) => void;
  onConfirm: () => Promise<void>;
}

const MediaItem = React.memo(
  ({
    url,
    index,
    onNavigate,
    isThumbnail,
  }: {
    url: string;
    index: number;
    onNavigate: (index: number) => void;
    isThumbnail: boolean;
  }) => {
    const handlePress = useCallback(
      () => onNavigate(index),
      [onNavigate, index]
    );

    if (!url?.startsWith("file")) {
      url = getImage(url);
    }

    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`${isThumbnail ? "w-16 h-16" : "w-full h-full"}`}
        accessibilityRole="button"
        accessibilityLabel={`View image ${index + 1}`}
      >
        <Image
          source={{ uri: url }}
          className={`w-full h-full overflow-hidden ${
            isThumbnail ? "rounded-xl" : "rounded-2xl"
          }`}
          resizeMode={isThumbnail ? "cover" : "contain"}
          accessibilityRole="image"
        />
      </TouchableOpacity>
    );
  }
);

export default function MediaViewer({
  isVisible,
  onClose,
  currentIndex,
  mediaItems,
  album,
  onDismiss,
  showDelete,
  onConfirm,
  onNavigate,
  onShare,
  loading,
  onDelete,
}: MediaViewerProps) {
  const handleDelete = () => {
    onDelete(currentIndex);
  };

  const formattedDate = useMemo(() => {
    return new Date(mediaItems[currentIndex]?.date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }, [mediaItems, currentIndex]);

  const renderThumbnail = useCallback(
    ({ item, index }: { item: MediaItem; index: number }) => (
      <View
        className={clsx([
          "relative",
          currentIndex === index && "border-4 border-purple-500 rounded-2xl ",
        ])}
      >
        <MediaItem
          url={item.file}
          index={index}
          onNavigate={onNavigate}
          isThumbnail={true}
        />
      </View>
    ),
    [onNavigate]
  );

  const handleShare = useCallback(async () => {
    if (onShare) {
      onShare(mediaItems[currentIndex].file);
    } else {
      try {
        const url = getImage(mediaItems[currentIndex].file);
        await Share.share({
          url,
          message: `Check out this media from ${album}!`,
        });
      } catch (error) {
        console.error("Error sharing media:", error);
      }
    }
  }, [onShare, mediaItems, currentIndex, album]);

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          <View className="px-4 py-2 relative items-center justify-between">
            <View className="absolute left-4 top-4 ">
              <Back action={onClose} />
            </View>
            <View>
              <Text className="text-center font-semibold text-2xl">
                {album}
              </Text>
              <Text className="text-gray-500 font-main">{formattedDate}</Text>
            </View>
          </View>

          {/* Main Image */}
          <View className="flex-1 px-4">
            <MediaItem
              url={mediaItems[currentIndex]?.file}
              index={currentIndex}
              onNavigate={onNavigate}
              isThumbnail={false}
            />
          </View>

          {/* Thumbnails */}
          <View className="px-4 py-2">
            <FlatList
              data={mediaItems}
              renderItem={renderThumbnail}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            />
          </View>

          <View className="flex-row justify-between px-12 py-4">
            <TouchableOpacity
              onPress={handleShare}
              className="items-center"
              accessibilityRole="button"
              accessibilityLabel="Share"
            >
              <Ionicons name="share" size={24} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="items-center"
              accessibilityRole="button"
              accessibilityLabel="Delete"
            >
              <FontAwesome5 name="trash" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {showDelete && (
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-lg font-semibold mb-2">Confirm Deletion</Text>
            <Text className="mb-4">
              Are you sure you want to delete this media item?
            </Text>
            <View className="flex-row justify-end">
              <Button onPress={onDismiss} mode="text" className="mr-2">
                Cancel
              </Button>
              <Button onPress={onConfirm} mode="text" buttonColor="#EF4444">
                Delete
                {loading && <ActivityIndicator />}
              </Button>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 99999,
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});
