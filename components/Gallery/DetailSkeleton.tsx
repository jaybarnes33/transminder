import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { ChevronLeft, MoreVertical } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_SPACING = 16;
const COLUMN_COUNT = 3;
const ITEM_SIZE =
  (SCREEN_WIDTH - GRID_SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

export default function AlbumDetailSkeleton() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const GridItem = () => (
    <Animated.View
      style={[
        {
          width: ITEM_SIZE,
          aspectRatio: 1,
          backgroundColor: "#E5E7EB",
          borderRadius: 12,
          margin: GRID_SPACING / 2,
        },
        animatedStyle,
      ]}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-2 flex-row items-center justify-between">
        <ChevronLeft size={24} className="text-gray-300" />
        <Animated.View
          style={[
            {
              width: 120,
              height: 28,
              backgroundColor: "#E5E7EB",
              borderRadius: 6,
            },
            animatedStyle,
          ]}
        />
        <View className="flex-row items-center space-x-4">
          <Animated.View
            style={[
              {
                width: 50,
                height: 20,
                backgroundColor: "#E5E7EB",
                borderRadius: 4,
              },
              animatedStyle,
            ]}
          />
          <MoreVertical size={20} className="text-gray-300" />
        </View>
      </View>

      <Animated.View
        style={[
          {
            marginLeft: 16,
            marginBottom: 16,
            width: 200,
            height: 16,
            backgroundColor: "#E5E7EB",
            borderRadius: 4,
          },
          animatedStyle,
        ]}
      />

      <View className="flex-row flex-wrap px-2">
        {[...Array(12)].map((_, index) => (
          <GridItem key={index} />
        ))}
      </View>
    </SafeAreaView>
  );
}
