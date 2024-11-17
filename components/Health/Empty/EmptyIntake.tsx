import React from "react";

import { ImageSourcePropType } from "react-native";
import EmptyState from ".";

const EmptyIntake = () => {
  return (
    <EmptyState
      image={require("@/assets/images/track.png") as ImageSourcePropType}
      heading="Keep track"
      description="Keep an eye on your intake data. Start tracking by completing an intake"
    />
  );
};

export default EmptyIntake;
