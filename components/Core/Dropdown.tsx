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
}: {
  data: T[];
  selectedValue: T;
  handleChange: (item: T) => void;
  placeholder: string;
  renderLeftIcon?: () => JSX.Element;
  range?: boolean;
}) => {
  const renderItem = (item: T) => {
    return (
      <View className="h-10 flex-row border-b border-gray-300  items-center px-3 ">
        <Text className={clsx(["font-main font-semibold"])}>{item.label}</Text>
      </View>
    );
  };

  return (
    <Dropdown
      style={{ ...styles.dropdown, maxWidth: range ? 115 : "auto" }}
      containerStyle={{ width: !range ? 100 : 150 }}
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
