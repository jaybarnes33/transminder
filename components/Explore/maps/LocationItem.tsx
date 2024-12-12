import { Location, Place } from "@/types/global";
import React, { memo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import PhotoCarousel from "./PhotosCarousel";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/Auth";
import { mutate } from "swr";
import Emoji from "@/components/Core/Emoji";

interface LocationItemProps {
  location: Place;
}

export const LocationItem = ({ location }: LocationItemProps) => {
  const { user } = useUser();
  const [bookmarked, setBookmarked] = useState(
    location.bookmarks.includes(user?._id as string)
  );

  const handleBookmark = async () => {
    try {
      setBookmarked((prev) => !prev);
      await axiosInstance.post(`/places/${location._id}/bookmark`, {
        placeId: location._id,
      });
      await Promise.all([
        mutate(`/places/${location._id}`),
        mutate((key: string) => key.includes("place")),
      ]);
    } catch (error) {
      console.log(error);
      setBookmarked(location.bookmarks.includes(user?._id as string));
    }
  };

  return (
    <View className="shadow gap-y-2 p-3 mb-1 bg-white rounded-2xl h-80">
      <View className="h-3/4 rounded-2xl overflow-hidden">
        <PhotoCarousel photos={location.photos} />
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text className="font-fwbold text-base capitalize">
            {location.name}
          </Text>
          <Text className="font-semibold text-neutral-400">
            {location.address.city}
          </Text>
        </View>

        <TouchableOpacity
          className="relative z-[9999]"
          onPress={handleBookmark}
        >
          <Emoji name={bookmarked ? "bookmark-active" : "bookmark"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
