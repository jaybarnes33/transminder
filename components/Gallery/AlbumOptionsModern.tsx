import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
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
  // {
  //   label: "Record audio",
  //   value: "audio",
  //   icon: <Mic size={20} color="#4B5563" />,
  // },
  // {
  //   label: "Record video clip",
  //   value: "video",
  //   icon: <Video size={20} color="#4B5563" />,
  // },
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

export default function AlbumOptionsDropdownModern({
  onSelect,
}: AlbumOptionsDropdownProps) {
  return (
    <View style={styles.container}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TouchableOpacity>
            <MoreVertical size={20} color="#4B5563" />
          </TouchableOpacity>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            <Text>Album Options</Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Album management options */}
          <DropdownMenuItem
            onPress={() => onSelect("rename")}
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1">Rename album</Text>
            <View className="ml-2">
              <Pencil size={20} color="#4B5563" />
            </View>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Media options */}
          <DropdownMenuItem
            onPress={() => onSelect("photo")}
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1">Take photo</Text>
            <View className="ml-2">
              <Camera size={20} color="#4B5563" />
            </View>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            onPress={() => onSelect("audio")}
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1">Record audio</Text>
            <View className="ml-2">
              <Mic size={20} color="#4B5563" />
            </View>
          </DropdownMenuItem> */}

          {/* <DropdownMenuItem
            onPress={() => onSelect("video")}
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1">Record video clip</Text>
            <View className="ml-2">
              <Video size={20} color="#4B5563" />
            </View>
          </DropdownMenuItem> */}

          <DropdownMenuItem
            onPress={() => onSelect("gallery")}
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1">Choose from Gallery</Text>
            <View className="ml-2">
              <ImageIcon size={20} color="#4B5563" />
            </View>
          </DropdownMenuItem>

          <DropdownMenuItem
            onPress={() => onSelect("file")}
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1">Choose from File</Text>
            <View className="ml-2">
              <Folder size={20} color="#4B5563" />
            </View>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Destructive action */}
          <DropdownMenuItem
            onPress={() => onSelect("delete")}
            variant="destructive"
            className="flex-row items-center justify-between"
          >
            <Text className="flex-1 text-red-500">Delete album</Text>
            <View className="ml-2">
              <Trash2 size={20} color="#EF4444" />
            </View>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}

const styles = {
  container: {
    position: "relative" as const,
    zIndex: 999999,
    elevation: 999999,
  },
};
