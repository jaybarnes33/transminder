import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Input from "./Input";
import { TextInput } from "react-native-gesture-handler";

const FrequencyPicker = ({
  handleChange,
  val,
  label = "Repeat",
}: {
  label?: string;
  handleChange: (val: { value: string; frequency?: number }) => void;
  val?: string;
}) => {
  const data = [
    { label: "Everyday", value: "everyday" },
    { label: "Weekly", value: "weekly", frequency: 1 },
    { label: "Monthly", value: "monthly", frequency: 1 },
    { label: "Once", value: "none" },
  ];

  const freqs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [value, setValue] = useState<(typeof data)[number]>(data[0]);

  useEffect(() => {
    if (val) {
      setValue(data.find((item) => item.value === val) ?? data[0]);
    }
  }, [val]);
  const renderItem = (item: { label: string; value: string }) => {
    return (
      <View style={styles.item}>
        <Text className="font-main font-semibold text-center">
          {item.label}
        </Text>
      </View>
    );
  };
  return (
    <View className="flex-row w-full justify-between gap-x-4 items-center ">
      <Text className="font-semibold">{label}</Text>
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
          handleChange(item);
        }}
        renderItem={renderItem}
        renderLeftIcon={() => (
          <View className="mx-2">
            <FontAwesome6 name="repeat" color="#0D96FF" />
          </View>
        )}
      />
      {(value.value === "weekly" || value.value === "monthly") && (
        <Dropdown
          labelField="label"
          valueField="value"
          style={styles.frequency}
          onChange={(item) => {
            setValue((val) => ({
              ...val,
              frequency: Number.parseInt(item.value),
            }));
            handleChange({ ...value, frequency: Number.parseInt(item.value) });
          }}
          placeholder="Frequency"
          value={
            value.frequency?.toString && {
              label: value.frequency?.toString(),
              value: value.frequency?.toString(),
            }
          }
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          renderLeftIcon={() => (
            <View className="mx-2">
              <Octicons name="number" color="#0D96FF" />
            </View>
          )}
          data={freqs.map(String).map((i) => ({ label: i, value: i }))}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: 150,
  },
  frequency: { width: 60 },
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
