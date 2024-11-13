import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ChevronDown, Plus, Settings } from "lucide-react-native";
import {
  Heart,
  BarChart2,
  Image as ImageIcon,
  Compass,
  Layers,
} from "lucide-react-native";

const albumData = [
  {
    id: "1",
    title: "Hair growth",
    count: 11,
    lastAdded: "2 days ago",
    images: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    hasVideo: true,
  },
  {
    id: "2",
    title: "Fitness",
    count: 1,
    lastAdded: "5 days ago",
    images: [],
  },
  // Add more album data as needed
];

const AlbumCard = ({ item }: { item: (typeof albumData)[number] }) => (
  <TouchableOpacity className="bg-white rounded-3xl p-4 mb-4 shadow-sm">
    <View className="flex-row flex-wrap gap-1 mb-3">
      {item.images.length > 0 ? (
        <>
          <Image
            source={{ uri: item.images[0] }}
            className="w-32 h-32 rounded-lg"
          />
          <View className="flex-1 flex-row flex-wrap gap-1">
            {item.images.slice(1, 5).map((image, index) => (
              <View key={index} className="relative w-[72px] h-[72px]">
                <Image
                  source={{ uri: image }}
                  className="w-full h-full rounded-lg"
                />
                {item.hasVideo && index === 2 && (
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
        <Text className="text-base font-semibold">{item.title}</Text>
        <Text className="text-xs font-main text-gray-500">
          Last added {item.lastAdded}
        </Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Text className="text-sm font-semibold text-gray-500">
          {item.count}
        </Text>
        <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function AlbumsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-baseline">
            <Text className="text-2xl font-semibold">Albums</Text>
            <Text className="text-2xl font-semibold text-gray-400 ml-1">3</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Settings className="text-gray-600" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-gray-600 font-main mr-1">Most recent</Text>
            <ChevronDown size={16} className="text-gray-600" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Plus size={24} className="text-gray-600" />
          </TouchableOpacity>
        </View>
      </View>

      <FlashList
        data={albumData}
        renderItem={({ item }: { item: (typeof albumData)[number] }) => (
          <AlbumCard item={item} />
        )}
        estimatedItemSize={200}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
}
