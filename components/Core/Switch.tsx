import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  StyleSheet,
  Button,
  Text,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const Switch = ({
  value,
  onPress,
  duration = 400,
  trackColors = { on: "#b85adf", off: "#fa7f7c" },
}: {
  value: boolean;
  onPress: () => void;
  duration?: number;
  trackColors?: { on: string; off: string };
}) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      1,
      [0, 1],
      [trackColors.off, trackColors.on]
    );
    const colorValue = withTiming(color, { duration });

    return {
      backgroundColor: colorValue,
      borderRadius: height / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(value), [0, 1], [0, width - height]);
    const translateValue = withTiming(moveValue, { duration });

    return {
      transform: [{ translateX: translateValue }],
      borderRadius: height / 2,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          setHeight(e.nativeEvent.layout.height);
          setWidth(e.nativeEvent.layout.width);
        }}
        style={[
          switchStyles.track,
          { width: 51, height: 31 },
          trackAnimatedStyle,
        ]}
      >
        <Animated.View
          className={`h-6 w-6 bg-white rounded-full border border-purple-500`}
          style={[switchStyles.thumb, thumbAnimatedStyle]}
        ></Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const switchStyles = StyleSheet.create({
  track: {
    position: "relative",
  },
  thumb: {
    height: 30,
    width: 30,
    position: "absolute",
    backgroundColor: "white",
  },
});

export default Switch;
