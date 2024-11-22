import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Flag,
  FileText,
  Heart,
  Activity,
  MessageCircle,
  Snowflake,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Component() {
  const router = useRouter();

  const collections = [
    {
      id: 1,
      title: "Transition Basics",
      icon: Flag,
      color: "bg-emerald-400",
      route: "/transition",
    },
    {
      id: 2,
      title: "Healthcare and Wellness",
      icon: Snowflake,
      color: "bg-sky-400",
      route: "/healthcare",
    },
    {
      id: 3,
      title: "Legal Rights and Advocacy",
      icon: FileText,
      color: "bg-gray-500",
      route: "/legal",
    },
    {
      id: 4,
      title: "Emotional and Mental Health",
      icon: Heart,
      color: "bg-purple-400",
      route: "/mental-health",
    },
    {
      id: 5,
      title: "Physical Activity and Fitness",
      icon: Activity,
      color: "bg-orange-400",
      route: "/fitness",
    },
    {
      id: 6,
      title: "Social and Community Resources",
      icon: MessageCircle,
      color: "bg-blue-400",
      route: "/community",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-semibold">Search</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <View className="relative">
            <View className="absolute left-3 top-2.5 z-10">
              <Search size={20} className="text-gray-400" />
            </View>
            <TextInput
              placeholder="Search"
              className={`h-11 pl-11 pr-4 rounded-xl border border-purple-400 text-base
                ${Platform.select({
                  ios: "bg-gray-50",
                  android: "bg-transparent",
                })}`}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <Text className="text-base font-medium mb-4">
          Collections you might like
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-4 pb-4">
            {collections.map((item) => (
              <TouchableOpacity
                key={item.id}
                className={`w-[47%] p-4 rounded-xl ${item.color}`}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/learn",
                    params: { search: item.title },
                  })
                }
              >
                <item.icon size={24} color="white" />
                <Text className="text-white font-medium mt-2 text-base">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
