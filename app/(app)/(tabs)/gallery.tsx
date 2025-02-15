import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ChevronDown, Plus, Settings } from "lucide-react-native";

import { Actions } from "@/components/Core/Header";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import useSWR from "swr";
import EmptyState from "@/components/Health/Empty";
import { Album, PaginatedResponse } from "@/types/global";
import GallerySkeleton from "@/components/Gallery/Skeleton";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { getImage } from "@/utils";

const AlbumCard = ({
  item,
}: {
  item: {
    name: string;
    media: { file: string; date: string }[];
    updatedAt: string;
    createdAt: string;
    _id: string;
  };
}) => {
  const { navigate } = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        navigate({
          pathname: "/(app)/album-details",
          params: {
            id: item._id,
          },
        })
      }
      className="bg-white rounded-3xl p-4 mb-4 shadow-sm"
    >
      <View className="flex-row flex-wrap gap-1 gap-x-2 mb-3">
        {item.media.length > 0 ? (
          <>
            <Image
              source={{ uri: getImage(item.media[0]?.file) }}
              className=" w-40 h-40 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 gap-1">
              {item.media.slice(1, 4).map((image, index) => (
                <View key={index} className="relative w-[72px] h-[72px]">
                  <Image
                    source={{ uri: getImage(image?.file) }}
                    className="w-full h-full rounded-lg"
                  />
                  {item.media.find((mediaItem) =>
                    mediaItem?.file.includes("mp4")
                  ) &&
                    index === 2 && (
                      <View className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded-full">
                        <Text className="text-white font-semibold text-xs">
                          0:18
                        </Text>
                      </View>
                    )}
                </View>
              ))}
            </View>
          </>
        ) : (
          <View className="w-full h-32 bg-gray-100 rounded-lg" />
        )}
      </View>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold">{item.name}</Text>
          {item.updatedAt !== item.createdAt && (
            <Text className="text-xs font-main text-gray-500">
              Last added {format(item.updatedAt, "MMM dd, yyyy")}
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-semibold text-gray-500">
            {item.media.length}
          </Text>
          <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AlbumsScreen() {
  const { navigate } = useRouter();

  const fetchAlbums = async () => {
    const { data } = await axiosInstance.get("/albums");
    return data;
  };

  const { data: albumData, isLoading } = useSWR<PaginatedResponse<Album[]>>(
    "/albums",
    fetchAlbums
  );

  if (isLoading) {
    return <GallerySkeleton />;
  }
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row gap-x-2 items-baseline">
            <Text className="text-2xl font-semibold">Albums</Text>
            {albumData && albumData.data?.length > 0 && (
              <Text className="text-2xl font-semibold text-gray-400 ml-1">
                {albumData.data.length}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-4">
            <Actions activity={false} />
          </View>
        </View>

        {albumData && albumData.data.length > 0 && (
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-gray-600 font-main mr-1">Most recent</Text>
              <ChevronDown size={16} className="text-gray-600" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate("/(app)/createAlbum")}>
              <Plus size={24} className="text-gray-600" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlashList
        data={albumData?.data}
        ListEmptyComponent={
          <EmptyState
            image={require("@/assets/images/calendar-empty.png")}
            heading="No items in gallery"
            buttonLabel="Create album"
            buttonAction={() => navigate("/(app)/createAlbum")}
            description="Create an album to begin tracking your journey"
          />
        }
        renderItem={({ item }) => <AlbumCard item={item} />}
        estimatedItemSize={200}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
}
