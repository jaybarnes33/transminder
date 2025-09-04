import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
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

export default function AlbumOptionsDropdown({
  onSelect,
}: AlbumOptionsDropdownProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MoreVertical size={20} color="#4B5563" />
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
        style={styles.menu}
        anchorPosition="bottom"
      >
        {options.map((option, i) => (
          <List.Item
            key={option.value}
            title={option.label}
            titleStyle={[
              styles.menuItemText,
              option.value === "delete" && styles.deleteText,
            ]}
            style={[
              styles.menuItem,
              i !== options.length - 1 && styles.menuItemBorder,
            ]}
            right={() => <View>{option.icon}</View>}
            onPress={() => {
              onSelect(option.value);
              setMenuVisible(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 999999,
    elevation: 999999,
  },
  menu: {
    zIndex: 999999,
    elevation: 999999,
  },
  menuContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: 240,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 8,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemBorder: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontFamily: "Quicksand",
    fontWeight: "600",
    fontSize: 14,
    color: "#4B5563",
  },
  deleteText: {
    color: "#EF4444",
  },
});
