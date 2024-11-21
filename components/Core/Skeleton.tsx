import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SkeletonLoaderProps {
  // Add any additional props here if needed
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = () => {
  const insets = useSafeAreaInsets();
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  const shimmerStyle = {
    transform: [{ translateX }],
  };

  return (
    <View
      className="px-4"
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <View style={styles.headerTitle} />
          <View style={styles.headerSubtitle} />
        </View>
      </View>

      {/* Content Skeleton */}
      <View style={styles.content}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardTitle} />
              <View style={styles.cardDescription} />
            </View>
          </View>
        ))}
      </View>

      {/* Shimmer Effect */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.shimmer, shimmerStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    width: "60%",
    height: 18,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  headerSubtitle: {
    width: "40%",
    height: 14,
    backgroundColor: "#e0e0e0",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    width: "80%",
    height: 18,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  cardDescription: {
    width: "100%",
    height: 14,
    backgroundColor: "#e0e0e0",
  },
  shimmer: {
    width: 350,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});

export default SkeletonLoader;
