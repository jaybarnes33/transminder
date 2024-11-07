import React from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const ResourceLoader = () => {
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
        {/* Large thumbnail skeleton */}
        <View style={styles.thumbnailContainer}>
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

        <View style={styles.content}>
          {/* Article type skeleton */}
          <View style={styles.articleType}>
            <View style={styles.icon} />
            <View style={styles.typeText} />
          </View>

          {/* Title skeleton */}
          <View style={styles.titleContainer}>
            <View style={styles.titleLine} />
            <View style={[styles.titleLine, { width: "60%" }]} />
          </View>

          {/* Time skeleton */}
          <View style={styles.timeSkeleton} />
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#EEEEEE",
  },
  content: {
    padding: 16,
    gap: 12,
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
  titleContainer: {
    gap: 8,
  },
  titleLine: {
    width: "100%",
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
