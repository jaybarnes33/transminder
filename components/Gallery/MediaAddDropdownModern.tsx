import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import {
  Camera,
  Mic,
  Video,
  Image as ImageIcon,
  Folder,
  Plus,
} from "lucide-react-native";
import clsx from "clsx";

interface MediaAddDropdownProps {
  onSelect: (value: string) => void;
}

export default function MediaAddDropdownModern({
  onSelect,
}: MediaAddDropdownProps) {
  const options = [
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
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TouchableOpacity className="h-32 mb-2 top-1 mr-1  bg-purple-200 justify-center rounded-xl items-center">
          <View>
            <Plus size={50} color="#9333EA" />
          </View>
        </TouchableOpacity>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 ">
        {options.map((option, i) => (
          <DropdownMenuItem
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={clsx(
              "flex-row items-center justify-between",
              i !== options.length - 1 && "border-b border-gray-300"
            )}
          >
            <Text className="flex-1">{option.label}</Text>
            <View className="ml-2">{option.icon}</View>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
