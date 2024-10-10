import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const FrequencyPicker = ({
  handleChange,
}: {
  handleChange: (val: string) => void;
}) => {
  const data = [
    { label: "Every day", value: "daily" },
    { label: "Every week", value: "weekly" },
    { label: "Every month", value: "monthly" },
    { label: "No repeat", value: "none" },
  ];

  const [value, setValue] = useState<(typeof data)[number]>(data[0]);
  const renderItem = (item: { label: string; value: string }) => {
    return (
      <View style={styles.item}>
        <Text className="font-main font-semibold">{item.label}</Text>
      </View>
    );
  };
  return (
    <Text className="font-main">
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value}
        selectedTextProps={{
          style: {
            fontFamily: "Quicksand_400Regular",
            fontSize: 16,
          },
        }}
        onChange={(item) => {
          setValue(item);
          handleChange(item.value);
        }}
        renderItem={renderItem}
        renderLeftIcon={() => (
          <View className="mx-2">
            <FontAwesome6 name="repeat" color="#0D96FF" />
          </View>
        )}
      />
    </Text>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 150,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default FrequencyPicker;
