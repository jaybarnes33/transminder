import { View, Text } from "react-native";
import React from "react";
import Heading from "../Core/Heading";
import Appointment from "./Appointment";

const Appointments = () => {
  return (
    <View className="my-4">
      <Heading text="Appointments" more="View Calendar" />
      <View className="mt-2">
        <Appointment
          appointment={{
            name: "Dentist",
            date: "2022-12-12",
            start: "12:00",
            location: "123 Main St",
            end: "13:00",
            doctor: "Dr. Smith",
          }}
        />
      </View>
    </View>
  );
};

export default Appointments;
