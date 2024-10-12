import React from "react";
import { useRouter } from "expo-router";

import { ImageSourcePropType } from "react-native";
import EmptyState from ".";

const EmptyPlan = () => {
  const { navigate } = useRouter();

  return (
    <EmptyState
      image={require("@/assets/images/plan-blank.png") as ImageSourcePropType}
      heading="No medications added yet"
      description="Stay on top of your health by adding your medications and reminders. We'll help you keep everything in check."
      buttonLabel="Add meds"
      color="bg-blue-500"
      buttonAction={() => navigate("/(medications)/add")}
    />
  );
};

export default EmptyPlan;
