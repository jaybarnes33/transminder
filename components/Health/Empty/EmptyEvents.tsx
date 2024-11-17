import React from "react";
import { useRouter } from "expo-router";

import EmptyState from ".";

const EmptyEvents = () => {
  const { navigate } = useRouter();

  return (
    <EmptyState
      image={require("@/assets/images/calendar-empty.png")}
      heading="No upcoming events"
      description="Keep track of your milestones, health check-ins, and events all in one place. Add them here, and we’ll remind you when it’s time."
      buttonLabel="Add event"
      buttonAction={() => navigate("/(app)/(calendar)/add")}
    />
  );
};

export default EmptyEvents;
