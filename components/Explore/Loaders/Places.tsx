import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const PlaceCardSkeleton = () => {
  const opacity = useSharedValue(0.5);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
          style={styles.image}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <View style={styles.dotContainer}>
          {[0, 1, 2].map((_, index) => (
            <View key={index} style={styles.dot} />
          ))}
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.titleSkeleton} />
          <View style={styles.bookmarkSkeleton} />
        </View>
        <View style={styles.addressSkeleton} />
        <View style={styles.tagsContainer}>
          <View style={styles.tagSkeleton} />
          <View style={[styles.tagSkeleton, { width: 100 }]} />
        </View>
      </View>
    </Animated.View>
  );
};

const PlacesLoader = () => {
  return (
    <ScrollView style={styles.container}>
      {[1, 2, 3].map((key) => (
        <PlaceCardSkeleton key={key} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  image: {
    flex: 1,
  },
  dotContainer: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleSkeleton: {
    height: 24,
    width: "70%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  bookmarkSkeleton: {
    height: 24,
    width: 24,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
  },
  addressSkeleton: {
    height: 16,
    width: "50%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagSkeleton: {
    height: 24,
    width: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginRight: 8,
  },
});

export default PlacesLoader;
