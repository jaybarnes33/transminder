import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { countries } from "@/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import Input from "./Input";
import clsx from "clsx";
import { Feather } from "@expo/vector-icons";

const Countries = ({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (text: string) => void;
}) => {
  const [countryList, setCountryList] = useState(countries);
  const [selected, setSelected] = useState(current);
  const searchCountry = (text: string) => {
    setSelected(text);
    const filtered = countries.filter((country) =>
      text ? country.name.toLowerCase().includes(text?.toLowerCase()) : true
    );
    setCountryList(filtered);
  };

  const onSelectCountry = (name: string) => {
    setSelected(name);
    onSelect(name);
    Keyboard.dismiss();
  };

  useEffect(() => {
    searchCountry(current);
  }, [current]);

  return (
    <View className="h-[60vh]">
      <View className="space-y-1">
        {selected?.length > 0 && (
          <TouchableOpacity
            className="flex-row items-center space-x-2 my-1 mx-2"
            onPress={() => searchCountry("")}
          >
            <Text className="font-semibold text-base">Clear</Text>
            <Feather name="x" size={16} color="gray" />
          </TouchableOpacity>
        )}
        <View>
          <Input
            placeholder="Country"
            value={selected}
            defaultValue={current}
            onChangeText={(text) => searchCountry(text)}
          />
        </View>
      </View>
      <FlatList
        data={countryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectCountry(item.name)}
            className={clsx([
              "h-12 px-3 font-main font-semibold  py-1 rounded-xl lowercase my-1 justify-center",
              selected === item.name && "bg-purple-100",
            ])}
          >
            <Text className="font-main  text-dark">
              <Text>{item.flag}</Text> {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

export default Countries;
