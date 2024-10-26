import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Resource } from "@/types/global";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/Core/Back";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import Head from "@/components/Resources/Resource";

const ResourceScreen = () => {
  const { resource: resourceString } = useLocalSearchParams();
  const resource: Resource = JSON.parse(resourceString as string);

  const handleOpenURL = () => {
    if (resource.url) {
      Linking.openURL(resource.url);
    }
  };

  return (
    <SafeAreaView className="px-4 flex-1 bg-neutral-50">
      <View className="flex-row items-center pb-4 justify-between">
        <Back />
        <TouchableOpacity>
          <Ionicons name="bookmark" size={24} color="#777" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Head resource={resource} heading />
        <View className="flex-row space-x-2 mb-4">
          {resource.tags.map((tag, index) => (
            <View key={index} className="bg-neutral-200 px-3 py-1 rounded-lg">
              <Text className="font-semibold capitalize text-neutral-500">
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {resource.type === "article" && resource.content && (
          <View className="mb-6">
            <Text className="mt-2 text-neutral-500 text-base font-semibold">
              {resource.content}
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
