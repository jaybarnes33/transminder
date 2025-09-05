import React from "react";
import { View, Text } from "react-native";
import Back from "@/components/Core/Back";
import AlbumOptionsDropdownModern from "@/components/Gallery/AlbumOptionsModern";

interface AlbumHeaderProps {
  name: string;
  mediaCount: number;
  createdAt: string;
  onAlbumOption: (option: string) => void;
}

export const AlbumHeader: React.FC<AlbumHeaderProps> = ({
  name,
  mediaCount,
  createdAt,
  onAlbumOption,
}) => {
  return (
    <>
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
            <AlbumOptionsDropdownModern onSelect={onAlbumOption} />
          </View>
        </View>
      </View>

      <Text className="px-4 font-semibold text-gray-500 mb-4">
        {mediaCount || 0} items • Created on{" "}
        {new Date(createdAt).toLocaleDateString()}
      </Text>
    </>
  );
};
