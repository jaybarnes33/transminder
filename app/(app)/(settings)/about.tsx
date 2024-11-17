import { View, Text, Linking } from "react-native";
import React from "react";
import Wrapper from "@/components/Settings/Wrapper";
import { TouchableOpacity } from "react-native-gesture-handler";

const About = () => {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Wrapper>
      <View className="mt-5 gap-y-4">
        <Text className="font-main text-base text-dark">
          Transminder was created with one goal in mind: to make health
          management easier and more inclusive for trans folx.
        </Text>
        <Text className="font-main text-base text-dark">
          We understand that every journey is unique, and your health deserves
          tools that reflect that. This app is designed to support you, offering
          a safe and empowering space to track, manage, and understand your
          health.
        </Text>
        <Text className="font-main text-base text-dark">
          Our mission goes beyond the app itself. We’re building a community
          that prioritizes well-being, safety, and respect. Through every
          update, reminder, and connection, we’re here to help you feel more in
          control of your health journey.
        </Text>
        <Text className="font-main text-base text-dark">
          At Transminder, your privacy and safety are our top priorities. We are
          committed to protecting your data and ensuring that your information
          is handled securely. For more details on how we safeguard your privacy
          and your rights as a user, please review our{" "}
          <TouchableOpacity
            onPress={() =>
              handlePress("https://www.transminder.app/privacy-policy")
            }
          >
            <Text className="text-blue-500 underline">Privacy Policy</Text>
          </TouchableOpacity>{" "}
          and{" "}
          <TouchableOpacity
            onPress={() =>
              handlePress("https://www.transminder.app/terms-of-service")
            }
          >
            <Text className="text-blue-500 underline">Terms of Service</Text>
          </TouchableOpacity>
          , accessible through the app.
        </Text>
        <Text className="font-main text-base text-dark">
          By using Transminder, you are joining us in shaping a future where
          trans health is recognized and celebrated.
        </Text>
      </View>
    </Wrapper>
  );
};

export default About;
