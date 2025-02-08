import { StyleSheet, VirtualizedList } from "react-native";
import React from "react";
import Calendar from "@/components/Health/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import Tracker from "@/components/Health/Tracker";
import Header from "@/components/Core/Header";
import Plan from "@/components/Health/Plan";
import Appointments from "@/components/Calendar/Appointments";
import Track from "@/components/Health/Track";
import Premium from "@/components/Health/Premium";
import { DayObj } from "@/types/global";
import { transformDate } from "@/utils";
const Index = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [day, setDay] = React.useState<DayObj>(transformDate(date));

  const sections = [
    { key: "Calendar", component: <Calendar day={day} setDay={setDay} /> },
    { key: "Tracker", component: <Tracker date={day.date} /> },
    { key: "Plan", component: <Plan /> },
    {
      key: "Appointments",
      component: <Appointments date={new Date().toISOString()} limitted />,
    },
    { key: "Track", component: <Track /> },
    // { key: "Premium", component: <Premium /> },
  ];
  const getItem = (data: typeof sections, index: number) => data[index];

  const getItemCount = (data: typeof sections) => data.length;
  return (
    <SafeAreaView className="px-3">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />
      <Header />
      <VirtualizedList
        data={sections}
        initialNumToRender={4}
        contentContainerStyle={{ paddingBottom: 200 }}
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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
  },
});

export default Index;
