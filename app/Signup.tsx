import { View, Text } from "react-native";
import React from "react";

import { SignUpProvider } from "@/context/Signup";
import Form from "@/components/Auth/Signup/Form";
import { useRoute } from "@react-navigation/native";

const Signup = () => {
  const route = useRoute();

  const { email } = route.params as { email: string };
  return (
    <SignUpProvider>
      <Form email={email} />
    </SignUpProvider>
  );
};

export default Signup;
