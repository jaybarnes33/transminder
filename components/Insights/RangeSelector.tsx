import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Menu, List, PaperProvider } from "react-native-paper";
import { ChevronDown } from "lucide-react-native";

interface RangeSelectorProps {
  selectedValue: string;
  handleChange: (value: { label: string; value: string }) => void;
  data: { label: string; value: string }[];
}

export default function RangeSelector({
  selectedValue,
  handleChange,
  data,
}: RangeSelectorProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <PaperProvider settings={{ rippleEffectEnabled: true }}>
      <View style={styles.container}>
        <Menu
          contentStyle={{
            backgroundColor: "white",
            borderRadius: 16,

            position: "absolute",
            zIndex: 9999999,
          }}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity className="p-2" onPress={openMenu}>
              <View className="bg-purple-50 rounded-xl flex-row items-center justify-between px-4 py-2">
                <Text>{selectedValue}</Text>
                <ChevronDown size={24} className="text-purple-500" />
              </View>
            </TouchableOpacity>
          }
        >
          {/* Dropdown Items */}
          {data.map((option, i) => (
            <List.Item
              borderless={false}
              style={
                i !== data.length - 1 && {
                  borderBottomColor: "#E5E7EB",
                  borderBottomWidth: 1,
                }
              }
              key={option.value}
              title={option.label}
              titleStyle={{
                color: "#4B5563",
                fontFamily: "Quicksand",
                fontWeight: "600",
              }}
              onPress={() => {
                handleChange(option);
                closeMenu();
              }}
            />
          ))}
        </Menu>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
