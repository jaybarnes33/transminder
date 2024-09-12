import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Calendar from "@/components/Health/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/context/Auth";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import Tracker from "@/components/Health/Tracker";
import { Feather } from "@expo/vector-icons";
import Icon from "@/components/Core/Icon";
import Header from "@/components/Core/Header";
const index = () => {
  const { user } = useUser();
  return (
    <SafeAreaView className="px-4">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />

      <Header />
      <Calendar />
      <Tracker />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
});

export default index;
