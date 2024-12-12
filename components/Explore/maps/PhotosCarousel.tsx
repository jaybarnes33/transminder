import { getImage } from "@/utils";
import clsx from "clsx";
import { Image } from "expo-image";
import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewToken,
} from "react-native";

const { width } = Dimensions.get("window");

interface PhotoCarouselProps {
  photos: string[];
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<string>>(null); // Create a ref for FlatList

  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisibleItemIndex = viewableItems[0]?.index;
      if (
        firstVisibleItemIndex !== null &&
        firstVisibleItemIndex !== undefined
      ) {
        setCurrentIndex(firstVisibleItemIndex);
      }
    }
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  const renderItem = ({ item }: { item: string }) => {
    return (
      <Image
        source={{ uri: getImage(item) }}
        className="h-full"
        style={{ width: width - 32 }}
      />
    );
  };

  const handleIndicatorPress = (index: number) => {
    setCurrentIndex(index); // Update current index state
    flatListRef.current?.scrollToIndex({ index, animated: true }); // Scroll to the selected index
  };

  return (
    <View className="h-full">
      <FlatList
        ref={flatListRef} // Attach the ref to FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig}
        showsHorizontalScrollIndicator={false}
      />
      <View className="flex-row absolute bottom-4 w-full justify-center gap-x-1">
        {photos?.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleIndicatorPress(index)} // Handle indicator click
            className={clsx([
              "w-3 h-3 bg-gray-200 rounded-full",
              currentIndex === index && "bg-white w-6",
            ])}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "75%", // Adjust as needed
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: width, // Full width of the screen
    height: "100%", // Full height of the container
  },
  indicators: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  activeIndicator: {
    backgroundColor: "blue", // Change as needed
  },
  inactiveIndicator: {
    backgroundColor: "gray", // Change as needed
  },
});

export default PhotoCarousel;
