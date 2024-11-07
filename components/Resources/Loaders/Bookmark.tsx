import React from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const BookmarkLoader = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          {/* Thumbnail skeleton */}
          <View style={styles.thumbnailContainer}>
            <View style={styles.thumbnail}>
              <AnimatedLG
                colors={["#EEEEEE", "#DDDDDD", "#EEEEEE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    transform: [{ translateX }],
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.textContent}>
            {/* Article type skeleton */}
            <View style={styles.articleType}>
              <View style={styles.icon} />
              <View style={styles.typeText} />
            </View>

            {/* Title skeleton */}
            <View style={styles.titleSkeleton} />

            {/* Time skeleton */}
            <View style={styles.timeSkeleton} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    gap: 16,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  articleType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
  },
  typeText: {
    width: 60,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
  },
  titleSkeleton: {
    width: "80%",
    height: 24,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
  },
  timeSkeleton: {
    width: 40,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
  },
});
