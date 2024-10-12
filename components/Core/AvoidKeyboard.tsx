import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ViewStyle,
  ScrollViewProps,
  View,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";

interface KeyboardAvoidingScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  bg?: string;
  gradient?: boolean;
  keyboardVerticalOffset?: number; // Optionally adjust keyboard offset based on header or other components
}

const KeyboardAvoidingScrollView: React.FC<KeyboardAvoidingScrollViewProps> = ({
  children,
  contentContainerStyle,
  bg,
  gradient,
  keyboardVerticalOffset = 0,
  ...scrollViewProps
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {gradient && (
        <View className="absolute w-screen z-0  h-[100vh] ">
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="grad" x1="100%" x2="100%" y1="50%" y2="100%">
                <Stop offset="0" stopColor="#d9cae9" />
                <Stop offset="1" stopColor="#ffffff" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#grad)" />
          </Svg>
        </View>
      )}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          scrollEnabled={Keyboard.isVisible()}
          contentContainerStyle={[
            { flexGrow: 1, padding: 16 },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeyboardAvoidingScrollView;
