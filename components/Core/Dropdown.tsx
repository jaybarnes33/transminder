import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// Generic DropdownPicker component
const DropdownPicker = <T extends { label: string; value: string }>({
  data,
  selectedValue,
  handleChange,
  placeholder,
  renderLeftIcon,
  range,
  width,
}: {
  data: T[];
  selectedValue: T;
  handleChange: (item: T) => void;
  placeholder: string;
  renderLeftIcon?: () => JSX.Element;
  range?: boolean;
  width?: number;
}) => {
  const renderItem = (item: T) => {
    return (
      <View className="relative flex-row justify-between  border-gray-300 bg-white rounded-[16px] items-center p-4 ">
        <Text className={clsx(["font-main font-semibold text-neutral-600"])}>
          {item.label}
        </Text>
        {selectedValue.value === item.value && (
          <Feather name="check" size={20} color="#b85daf" />
        )}
        {!item.label.includes("time") && (
          <View className="absolute bottom-0 h-[1px] w-screen bg-neutral-200" />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={{
        ...styles.dropdown,
        maxWidth: range ? 115 : "auto",
      }}
      containerStyle={{
        width,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 16,
      }}
      placeholderStyle={styles.placeholderStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={selectedValue}
      selectedTextProps={{
        style: {
          fontFamily: !range ? "Quicksand_400Regular" : "Quicksand_700Bold",
          fontSize: !range ? 16 : 22,
        },
      }}
      onChange={handleChange}
      renderItem={renderItem}
      renderLeftIcon={renderLeftIcon}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
  },
  placeholderStyle: {
    fontSize: 16,
  },
});

export default DropdownPicker;
