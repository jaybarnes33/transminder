import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// Generic DropdownPicker component
const DropdownPicker = <T extends { label: string; value: string }>({
  data,
  selectedValue,
  handleChange,
  placeholder,
  renderLeftIcon,
}: {
  data: T[];
  selectedValue: T;
  handleChange: (item: T) => void;
  placeholder: string;
  renderLeftIcon?: () => JSX.Element;
}) => {
  const renderItem = (item: T) => {
    return (
      <View className="h-10 flex-row border-b border-gray-300  items-center px-3 ">
        <Text className="font-main font-semibold">{item.label}</Text>
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      containerStyle={{ width: 100 }}
      placeholderStyle={styles.placeholderStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={selectedValue}
      selectedTextProps={{
        style: {
          fontFamily: "Quicksand_400Regular",
          fontSize: 16,
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
