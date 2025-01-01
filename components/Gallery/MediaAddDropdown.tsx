import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Menu, List, PaperProvider } from "react-native-paper";

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
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              className="  h-40  bg-purple-200 justify-center rounded-xl items-center"
              onPress={openMenu}
              style={styles.button}
            >
              <View>
                <Plus size={50} color="#9333EA" />
              </View>
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
          style={styles.menu}
        >
          {options.map((option, i) => (
            <List.Item
              key={option.value}
              title={option.label}
              titleStyle={styles.menuItemTitle}
              style={[
                styles.menuItem,
                i !== options.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => {
                onSelect(option.value);
                closeMenu();
              }}
              right={() => <View style={styles.icon}>{option.icon}</View>}
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
    width: 100,
    height: 100,
  },
  button: {
    width: Dimensions.get("window").width / 3 - 10,

    margin: 5,
  },
  menu: {
    position: "absolute",
    top: 110, // Adjust this value to position the menu correctly
    left: 0,
  },
  menuContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 5,
    width: 270,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemBorder: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  menuItemTitle: {
    color: "#4B5563",
    fontFamily: "Quicksand",
    fontWeight: "600",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
