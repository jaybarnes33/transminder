import { View, Text } from "react-native";
import React from "react";

import { SignUpProvider } from "@/context/Signup";
import Form from "@/components/Auth/Signup/Form";

const Signup = () => {
  return (
    <SignUpProvider>
      <Form />
    </SignUpProvider>
  );
};

export default Signup;
