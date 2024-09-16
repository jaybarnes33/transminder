import { StyleSheet, VirtualizedList } from "react-native";
import React from "react";
import Calendar from "@/components/Health/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import Tracker from "@/components/Health/Tracker";
import Header from "@/components/Core/Header";
import Plan from "@/components/Health/Plan";
import Appointments from "@/components/Health/Appointments";
import Track from "@/components/Health/Track";
import Premium from "@/components/Health/Premium";
const Index = () => {
  const sections = [
    { key: "Calendar", component: <Calendar /> },
    { key: "Tracker", component: <Tracker /> },
    { key: "Plan", component: <Plan /> },
    { key: "Appointments", component: <Appointments /> },
    { key: "Track", component: <Track /> },
    { key: "Premium", component: <Premium /> },
  ];
  const getItem = (data: typeof sections, index: number) => data[index];

  const getItemCount = (data: typeof sections) => data.length;
  return (
    <SafeAreaView className="px-4">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />
      <Header />
      <VirtualizedList
        data={sections}
        initialNumToRender={4}
        renderItem={({ item }) => item.component}
        keyExtractor={(item) => item.key}
        getItem={getItem}
        getItemCount={getItemCount}
        showsVerticalScrollIndicator={false}
      />
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

export default Index;
