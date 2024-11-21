import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Menu, List, PaperProvider } from "react-native-paper";
import {
  Pencil,
  Camera,
  Mic,
  Video,
  Image as ImageIcon,
  Folder,
  Trash2,
  MoreVertical,
} from "lucide-react-native";

interface AlbumOptionsDropdownProps {
  onSelect: (value: string) => void;
}

export default function AlbumOptionsDropdown({
  onSelect,
}: AlbumOptionsDropdownProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const options = [
    {
      label: "Rename album",
      value: "rename",
      icon: <Pencil size={20} color="#4B5563" />,
    },
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
    {
      label: "Delete album",
      value: "delete",
      icon: <Trash2 size={20} color="#EF4444" />,
    },
  ];

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Menu
          contentStyle={{
            backgroundColor: "white",
            borderRadius: 16,
            elevation: 99999,
            width: 240,
            top: -40,
            position: "relative",
            zIndex: 9999,

            left: -(Dimensions.get("window").width / 1.17),
          }}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <MoreVertical size={20} color="#4B5563" />
            </TouchableOpacity>
          }
        >
          {options.map((option, i) => (
            <List.Item
              style={
                i !== options.length - 1 && {
                  borderBottomColor: "#E5E7EB",
                  borderBottomWidth: 1,
                }
              }
              key={option.value}
              title={option.label}
              titleStyle={{
                color: option.value === "delete" ? "#EF4444" : "#4B5563",
                fontFamily: "Quicksand",
                fontWeight: "600",
                fontSize: 14,
              }}
              right={() => <View>{option.icon}</View>}
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
});
