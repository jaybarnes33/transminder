import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface DeleteConfirmationProps {
  visible: boolean;
  loading: boolean;
  onConfirm: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  visible,
  loading,
  onConfirm,
}) => {
  if (!visible) return null;

  return (
    <View className="absolute bottom-10 left-0 right-0 items-center z-50">
      <TouchableOpacity
        onPress={onConfirm}
        className="items-center px-5 py-1 bg-red-100 flex-row rounded-full"
        disabled={loading}
      >
        <Text className="text-base font-semibold text-red-500">Delete</Text>
        {loading && <ActivityIndicator color="#EF4444" className="ml-2" />}
      </TouchableOpacity>

      <Text className="text-red-400 font-semibold mt-2 text-center px-4">
        Deleting is irreversible, Press the delete button again to confirm
      </Text>
    </View>
  );
};
