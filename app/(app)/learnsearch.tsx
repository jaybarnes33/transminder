import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  VirtualizedList,
  StyleSheet,
  Dimensions,
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
import { useLocalSearchParams, useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import { PaginatedResponse, Resource as IResource } from "@/types/global";
import useSWR from "swr";
import { ActivityIndicator } from "react-native-paper";
import Resource from "@/components/Resources/Resource";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-gesture-handler";

interface Collection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface DBCollection {
  _id: string;
  count: number;
  createdAt: string;
  name: string;
  updatedAt: string;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  "Transition Basics": Flag,
  "Healthcare and Wellness": Snowflake,
  "Legal Rights and Advocacy": FileText,
  "Emotional and Mental Health": Heart,
  "Physical Activity and Fitness": Activity,
  "Social and Community Resources": MessageCircle,
};

const colorMap: { [key: string]: string } = {
  "Transition Basics": "bg-emerald-400",
  "Healthcare and Wellness": "bg-sky-400",
  "Legal Rights and Advocacy": "bg-gray-500",
  "Emotional and Mental Health": "bg-purple-400",
  "Physical Activity and Fitness": "bg-orange-400",
  "Social and Community Resources": "bg-blue-400",
};

export default function Component() {
  const router = useRouter();
  const { search: keyword } = useLocalSearchParams();
  const [search, setSearch] = useState((keyword as string) ?? "");

  const fetchResources = async () => {
    const { data } = await axiosInstance.get(
      `/resources?search=${search}&order=desc&collections=${collection.id}`
    );
    return data;
  };

  const [collection, setCollection] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<IResource[]>
  >(
    `/resources?search=${search}&order="desc"&collections=${collection.id}`,
    fetchResources
  );

  const fetchCollections = async () => {
    const { data } = await axiosInstance.get("/resources/collections");
    return data;
  };

  const {
    data: dbCollections,
    error: errorCollection,
    isLoading: isLoadingCollections,
  } = useSWR<DBCollection[]>("/resources/collections", fetchCollections, {
    revalidateOnMount: true,
    refreshWhenHidden: true,
    refreshInterval: 10000 * 60,
  });

  const normalizeCollectionName = (name: string) => {
    return name.replace(/&/g, "and");
  };

  const mergedCollections = useMemo(() => {
    if (!dbCollections) return [];

    return dbCollections.map((dbCollection) => {
      const normalizedName = normalizeCollectionName(dbCollection.name);
      return {
        id: dbCollection._id,
        title: normalizedName,
        icon: iconMap[normalizedName] || Flag, // Default to Flag if no matching icon
        color: colorMap[normalizedName] || "bg-gray-400", // Default to gray if no matching color
      };
    });
  }, [dbCollections]);

  const sections = [
    {
      key: "SearchResults",
      component: (
        <>
          {isLoading && <ActivityIndicator />}
          <FlatList
            ListEmptyComponent={
              <Text className="font-semibold text-gray-600">
                No resources found{" "}
                {search
                  ? `matching ${search}`
                  : "matching your search criteria"}
              </Text>
            }
            data={data?.data ?? []}
            initialNumToRender={4}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => <Resource fullWidth resource={item} />}
            keyExtractor={(item: IResource) => item._id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </>
      ),
    },
    {
      key: "Collections",
      component: (
        <View className="my-4">
          <Text className="text-base font-semibold mb-4">
            Collections you might like
          </Text>

          {isLoadingCollections && <ActivityIndicator />}

          <View className="flex-row justify-between flex-wrap gap-4 pb-4">
            {mergedCollections.map((item) => (
              <TouchableOpacity
                key={item.id}
                className={`w-[48%] p-4 rounded-xl ${item.color}`}
                onPress={() => setCollection({ name: item.title, id: item.id })}
              >
                <item.icon size={24} color="white" />
                <Text className="text-white font-medium mt-2 text-base">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
  ];

  const getItem = (data: typeof sections, index: number) => data[index];
  const getItemCount = (data: typeof sections) => data.length;

  console.log({ mergedCollections });
  return (
    <SafeAreaView className="flex-1 px-4 bg-white">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-semibold">Search</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base font-main text-gray-500">Cancel</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-8">
        <View className="relative flex-row items-center">
          <View className="absolute left-3 z-10">
            <Search size={16} color="gray" className="text-gray-400" />
          </View>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            className={`h-11 pl-11 font-main flex-1 pr-4 rounded-xl border border-purple-400 text-base
              ${Platform.select({
                ios: "bg-gray-50",
                android: "bg-transparent",
              })}`}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <VirtualizedList
        data={sections}
        initialNumToRender={4}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.key}
        getItem={getItem}
        getItemCount={getItemCount}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
});
