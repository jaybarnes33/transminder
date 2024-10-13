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
      description="Keep an eye on your intake data. Start tracking by completing an intake"
    />
  );
};

export default EmptyIntake;
