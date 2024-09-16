import { View, Text } from "react-native";
import React from "react";
import { getDaysOfWeek } from "@/utils";
import clsx from "clsx";

const Item = ({
  day,
  active,
}: {
  day: { dayOfWeek: string; dayOfMonth: number };
  active: boolean;
}) => {
  return (
    <View
      className={clsx([
        "items-center justify-center  w-[45px] h-[76px] rounded-3xl space-y-1",
        active && "bg-white",
      ])}
    >
      <Text
        className={clsx(
          "font-main text-xs font-semibold text-gray-500 uppercase",
          active && "text-dark font-bold"
        )}
      >
        {day.dayOfWeek}
      </Text>
      <Text
        className={clsx([
          "font-main font-bold text-[20]",
          active ? "text-dark" : "text-gray-600",
        ])}
      >
        {day.dayOfMonth}
      </Text>

      {active && (
        <View className="bg-purple-500 w-2 h-2 absolute bottom-1 rounded-full" />
      )}
    </View>
  );
};
const Calendar = () => {
  const [days, setDays] = React.useState<
    { dayOfWeek: string; dayOfMonth: number }[]
  >([]);

  const [current, setCurrent] = React.useState<number>(0);
  React.useEffect(() => {
    setCurrent(new Date().getDate());
    setDays(getDaysOfWeek());
  }, []);

  return (
    <View className="flex-row justify-between">
      {days.map((day) => (
        <Item
          day={day}
          active={current === day.dayOfMonth}
          key={day.dayOfMonth}
        />
      ))}
    </View>
  );
};

export default Calendar;
