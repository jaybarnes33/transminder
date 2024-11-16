import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Menu, IconButton, List, PaperProvider } from "react-native-paper";

import {
  Camera,
  Mic,
  Video,
  Image as ImageIcon,
  Folder,
  Plus,
} from "lucide-react-native";

interface MediaAddDropdownProps {
  onSelect: (value: string) => void;
}

export default function MediaAddDropdown({ onSelect }: MediaAddDropdownProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const options = [
    {
      label: "Take photo",
      value: "photo",
      icon: <Camera size={20} color="#4B5563" />,
    },
    {
      label: "Record audio",
      value: "audio",
      icon: <Mic size={20} color="#4B5563" />,
    },
    {
      label: "Record video clip",
      value: "video",
      icon: <Video size={20} color="#4B5563" />,
    },
    {
      label: "Choose from Gallery",
      value: "gallery",
      icon: <ImageIcon size={20} color="#4B5563" />,
    },
    {
      label: "Choose from File",
      value: "file",
      icon: <Folder size={20} color="#4B5563" />,
    },
  ];

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Menu
          contentStyle={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 5,
            width: 270,
          }}
          anchorPosition="top"
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity className="w-1/3 p-2" onPress={openMenu}>
              <View className="bg-purple-50 rounded-xl aspect-square items-center justify-center">
                <Plus size={24} className="text-purple-500" />
              </View>
            </TouchableOpacity>
          }
        >
          {/* Dropdown Items */}
          {options.map((option, i) => (
            <List.Item
              borderless={false}
              style={
                i !== options.length - 1 && {
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
              right={() => <View style={styles.icon}>{option.icon}</View>}
              onPress={() => {
                onSelect(option.value);
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
  addButton: {
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
