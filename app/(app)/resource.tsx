import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Resource } from "@/types/global";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import Head from "@/components/Resources/Resource";
import RenderHTML from "react-native-render-html";
import Constants from "expo-constants";
import axiosInstance from "@/lib/axios";
import useSWR, { mutate } from "swr";
import Message from "@/components/Core/Message";
import Emoji from "@/components/Core/Emoji";
import { useUser } from "@/context/Auth";
const ResourceScreen = () => {
  const { user } = useUser();
  const { resource: id } = useLocalSearchParams();
  const fetchResource = async () => {
    const { data } = await axiosInstance.get(`/resources/${id}`);
    return data;
  };

  const { width } = useWindowDimensions();

  const {
    data: resource,
    isLoading,
    error,
    mutate: mutateResource,
  } = useSWR<Resource>(`/resources/${id}`, fetchResource);

  const [bookmarked, setBookmarked] = useState(
    resource?.bookmarks.includes(user?._id as string)
  );
  if (isLoading || !resource) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Message isError message={error ?? "Failed to load resource"} />;
  }
  const handleOpenURL = () => {
    if (resource.url) {
      Linking.openURL(resource.url);
    }
  };

  const htmlContent = `
  <html>
    <body>
      <div style="font-family: Quicksand">${resource.content}</div>
    </body>
  </html>
`;

  const handleBookmark = async () => {
    try {
      setBookmarked((prev) => !prev);
      await axiosInstance.post(`/resources/${id}/bookmark`, {
        resourceId: resource._id,
      });
      mutateResource();
      mutate(`/resources/bookmarks`);
    } catch (error) {
      setBookmarked(false);
    }
  };

  return (
    <SafeAreaView className="px-4 flex-1 bg-white">
      <View className="flex-row items-center pb-4 justify-between">
        <Back />
        <TouchableOpacity onPress={handleBookmark}>
          <Emoji name={bookmarked ? "bookmark-active" : "bookmark"} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Head resource={resource} heading />
        <View className="flex-row gap-x-2 ">
          {resource.tags.map((tag) =>
            tag.split(",").map((tag) => (
              <View
                key={tag}
                className="bg-neutral-200 mx-2 px-3 py-1 rounded-lg"
              >
                <Text className="font-semibold capitalize text-neutral-500">
                  {tag}
                </Text>
              </View>
            ))
          )}
        </View>

        {resource.type === "article" && resource.content && (
          <View className="mb-6">
            <Text className="font-main font-semibold">
              <RenderHTML
                systemFonts={[...Constants.systemFonts]}
                contentWidth={width}
                source={{
                  html: htmlContent,
                }}
              />
            </Text>
          </View>
        )}

        {resource.type === "guide" && resource.steps && (
          <View className="mb-6">
            {resource.steps.map((step, index) => (
              <View key={index} className=" mt-2 ">
                <Text className="font-semibold text-rose-500">
                  Step {index + 1}
                </Text>
                <Text className="text-neutral-500 text-base font-semibold">
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}

        {resource.type === "video" && resource.url && (
          <View>
            <Text className="font-semibold text-neutral-500 text-base">
              {resource.description}
            </Text>

            <TouchableOpacity
              onPress={handleOpenURL}
              className="mt-6 bg-blue-500 p-3 rounded-lg"
            >
              <Text className="text-center text-white font-semibold">
                Watch Video
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResourceScreen;
