import React from "react";
import { useRouter } from "expo-router";

import { ImageSourcePropType } from "react-native";
import EmptyState from ".";

const EmptyIntake = () => {
  const { navigate } = useRouter();

  return (
    <EmptyState
      image={require("@/assets/images/track.png") as ImageSourcePropType}
      heading="Keep track"
      description="Keep an eye on your routine and emotional well-being. Add your first entries, and we’ll help you stay on track."
    />
  );
};

export default EmptyIntake;
