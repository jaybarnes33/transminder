import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";

const Search = ({
  search,
  placeholder = "Search ....",
  term,
  clear,
}: {
  placeholder?: string;
  search: (term: string) => void;
  term: string;
  clear: () => void;
}) => {
  return (
    <View className="my-4 bg-white shadow flex-row p-3 gap-x-2 items-center rounded-lg h-12 justify-between">
      <Ionicons name="search" size={14} color="#aaa" />
      <TextInput
        className="flex-1 -mt-1 font-semibold text-base"
        placeholder={placeholder}
        onChangeText={search}
        value={term}
        onBlur={Keyboard.dismiss}
      />

      <TouchableOpacity onPress={clear}>
        <Feather name="x" size={20} color="#aaa" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
