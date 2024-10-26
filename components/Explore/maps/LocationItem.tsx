import { Location } from "@/types/global";
import { Ionicons } from "@expo/vector-icons";

import React, { memo } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PhotoCarousel from "./PhotosCarousel";

interface LocationItemProps {
  location: Location;
}

const LocationItemComponent = ({ location }: LocationItemProps) => {
  // render
  return (
    <View className="shadow space-y-2 p-3 mb-1 bg-white rounded-2xl   h-80">
      <View className="h-3/4  rounded-2xl overflow-hidden">
        <PhotoCarousel photos={location.photos} />
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text className="font-fwbold text-base capitalize">
            {location.name}
          </Text>
          <Text className="font-semibold text-neutral-400">
            {location.address}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark" size={24} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const LocationItem = memo(LocationItemComponent);
