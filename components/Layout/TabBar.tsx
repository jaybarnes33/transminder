import { View, TouchableOpacity, Image, Text } from "react-native";
import React, { ReactNode } from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Icon from "../Core/Icon";
import clsx from "clsx";
import { icons } from "@/constants/icons";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View className="bg-white shadow border-t border-gray-200 py-3 px-4 ">
      <View className="flex-row justify-between px-4 h-16 items-center">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const name = route.name === "index" ? "health" : route.name;
          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="items-center justify-center"
            >
              <View className="relative items-center">
                <Icon
                  name={
                    isFocused
                      ? (`${name}-active` as keyof typeof icons)
                      : (name as keyof typeof icons)
                  }
                />
                <Text
                  className={clsx([
                    "font-main text-xs capitalize font-semibold",
                    isFocused ? "text-dark" : "text-gray-500",
                  ])}
                >
                  {name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
