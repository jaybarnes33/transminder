import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ALBUM_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

const AlbumSkeleton = () => {
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

  return (
    <Animated.View style={[styles.albumCard, animatedStyle]}>
      <View style={styles.photoGrid}>
        <View style={styles.mainPhoto} />
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnail} />
          <View style={styles.thumbnail} />
          <View style={styles.thumbnail} />
          <View style={styles.thumbnail} />
        </View>
      </View>
      <View style={styles.albumInfo}>
        <View style={styles.titleRow}>
          <View style={styles.titlePlaceholder} />
          <View style={styles.chevron} />
        </View>
        <View style={styles.timestampPlaceholder} />
      </View>
    </Animated.View>
  );
};

export default function GallerySkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.albumsTitle} />
          <View style={styles.countBadge} />
        </View>
        <View style={styles.headerActions}>
          <View style={styles.dropdownPlaceholder} />
          <View style={styles.addButton} />
        </View>
      </View>

      <View style={styles.content}>
        <AlbumSkeleton />
        <AlbumSkeleton />
        <AlbumSkeleton />
      </View>

      <View style={styles.tabBar}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.tabItem}>
            <View style={styles.tabIcon} />
            <View style={styles.tabLabel} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  albumsTitle: {
    width: 120,
    height: 32,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  countBadge: {
    width: 24,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownPlaceholder: {
    width: 100,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
  albumCard: {
    width: ALBUM_WIDTH,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  photoGrid: {
    flexDirection: "row",
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  mainPhoto: {
    flex: 2,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginRight: 8,
  },
  thumbnailContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  thumbnail: {
    height: 44,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  albumInfo: {
    padding: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titlePlaceholder: {
    width: 120,
    height: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  chevron: {
    width: 20,
    height: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },
  timestampPlaceholder: {
    width: 150,
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: "center",
  },
  tabIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 4,
  },
  tabLabel: {
    width: 48,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
});
