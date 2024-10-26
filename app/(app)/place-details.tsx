import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { IconName, Location } from "@/types/global";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import { Ionicons, Octicons } from "@expo/vector-icons";
import PhotoCarousel from "@/components/Explore/maps/PhotosCarousel";
import Icon from "@/components/Core/Icon";
import clsx from "clsx";
import { toSentenceCase } from "@/utils";

const PlaceDetail = () => {
  const { place: data } = useLocalSearchParams();
  const [place, setPlace] = useState<Location>(JSON.parse(data as string));

  return (
    <SafeAreaView className="px-4">
      <View className="flex-row items-center pb-4 justify-between">
        <Back />
        <TouchableOpacity>
          <Ionicons name="bookmark" size={24} color="#777" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="space-y-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Photo Carousel */}
        <View className="h-[200] rounded-xl overflow-hidden">
          <PhotoCarousel photos={place.photos} />
        </View>
        <View className="space-y-2">
          <Text className="font-fwbold text-2xl">{place.name}</Text>
          {/* Type and Services */}
          <View className="flex-row mb-2 space-x-2">
            <View className="flex-row items-center bg-blue-200 p-2 rounded-lg space-x-1">
              <Icon name={place.type as IconName} />
              <Text className="font-semibold capitalize">{place.type}</Text>
            </View>
            <View className="flex-row items-center border border-neutral-400 p-2 rounded-lg space-x-1">
              <Text className="font-semibold text-neutral-500 capitalize">
                {place.services.length} services
              </Text>
            </View>
          </View>
          <Text className="font-main">{toSentenceCase(place.description)}</Text>
        </View>

        {/* Services List */}
        <View>
          <Text className="text-xl font-fwbold">
            Services{" "}
            <Text className="text-neutral-400">({place.services.length})</Text>
          </Text>
          <ScrollView
            className="py-2"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {place.services.map((service, index) => (
              <View
                key={index}
                className="w-1/4 mr-3 p-4 shadow rounded-lg h-32 bg-white items-center justify-center"
              >
                <Text className="capitalize font-semibold text-lg text-center">
                  {service}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="">
          <Text className="text-xl font-fwbold mt-4 mb-2">Information</Text>
          <View className="space-y-2 bg-white h-[130] justify-center p-4 rounded-[20px] shadow">
            <Text className="text-base font-semibold">Contact</Text>
            <View className="flex-row py-2 border-b border-neutral-300 justify-between">
              <Text className="font-semibold text-neutral-400">Phone:</Text>
              <Text className="text-blue-700 font-semibold">
                {place.contact?.phone}
              </Text>
            </View>
            <View className=" py-2 justify-between flex-row">
              <Text className="text-neutral-400 font-semibold">Email:</Text>
              <Text className=" font-semibold lowercase text-blue-700">
                {place.contact.email}
              </Text>
            </View>
          </View>

          {/* Working Hours */}

          <View className="px-4 py-3  bg-white rounded-[20px] mt-7 ">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold mb-2">
                Opening Hours
              </Text>
              <Text className="text-xs font-fwbold mb-2 text-green-500">
                Currently open &nbsp;
                <Octicons name="check-circle-fill" size={13} />
              </Text>
            </View>
            {place.workingHours.map((hour, index) => (
              <View
                key={index}
                className={clsx([
                  "h-10  border-neutral-300  flex-row justify-between items-center",
                  index !== place.workingHours.length - 1 && "border-b",
                ])}
              >
                <Text className="font-semibold text-neutral-400">
                  {hour.day}:
                </Text>
                <Text className="text-gray-700 font-semibold">
                  {hour.open} - {hour.close}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity
          className={clsx([
            "bg-dark flex-row h-[50] space-x-2 items-center justify-center w-full rounded-full mt-auto mb-5",
          ])}
        >
          <Text className="font-fwbold text-white">Save this place</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaceDetail;
