import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";

const Search = ({
  search,
  term,
}: {
  search: (term: string) => void;
  term: string;
}) => {
  return (
    <View className="my-4 bg-white shadow flex-row p-3 space-x-2 items-center rounded-lg h-12 justify-between">
      <Ionicons name="search" size={16} color="#aaa" />
      <TextInput
        className="flex-1 font-semibold text-base"
        placeholder="Search ...."
        onChangeText={search}
        value={term}
      />

      <TouchableOpacity onPress={() => search("")}>
        <Feather name="x" size={20} color="#aaa" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
