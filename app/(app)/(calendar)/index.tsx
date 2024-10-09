import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Back from "@/components/Core/Back";
import { Calendar, DateData } from "react-native-calendars";
import Appointments from "@/components/Health/Appointments";
import Appointment from "@/components/Health/Appointment";
import { formatDate } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import clsx from "clsx";

const Day = ({
  date,
  isActive,
  onPress,
}: {
  date: DateData;
  onPress: (date: string) => void;
  isActive: boolean;
}) => {
  return (
    <TouchableOpacity
      className={clsx([
        "h-8 w-8 items-center justify-center rounded-full",
        isActive && "bg-ring",
      ])}
      onPress={() => date && onPress(date?.dateString)}
    >
      <Text className={clsx([isActive && "text-white", "font-main text-base"])}>
        {date?.day}
      </Text>
    </TouchableOpacity>
  );
};
const Wrapper = () => {
  const [day, setDay] = useState("");

  const { navigate } = useRouter();

  return (
    <SafeAreaView className="px-4">
      <LinearGradient
        colors={["#e4d6f3", "#f3f4f6"]}
        style={styles.background}
      />
      <View className="flex-row justify-between items-center">
        <Back />
        <Text className="font-main flex-1 text-center text-base">Calendar</Text>
      </View>

      <View>
        <Text>{}</Text>
        <Calendar
          onDayPress={(date) => setDay(date.dateString)}
          style={styles.calendar}
          hideExtraDays
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
          }}
          dayComponent={({ date }) =>
            date && (
              <Day
                date={date}
                onPress={setDay}
                isActive={Number.parseInt(day.split("-")[2]) === date?.day}
              />
            )
          }
        />

        <View>
          <View className="flex-row mt-4 items-center justify-between">
            <Text className="text-xl font-fwbold">
              {formatDate(
                day ? day : new Date().toISOString(),
                "EEEE, dd MMMM yyyy"
              )}
            </Text>

            <TouchableOpacity onPress={() => navigate("/(app)/(calendar)/add")}>
              <Feather name="plus" size={20} color={"#bb5adf"} />
            </TouchableOpacity>
          </View>
          <Appointments limitted />
        </View>
      </View>
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
  calendar: {
    backgroundColor: "transparent",
  },
});
export default Wrapper;
