import { View } from "react-native";
import { useState } from "react";
import DropdownPicker from "../Core/Dropdown";

const ActivityTypePicker = ({
  handleChange,
}: {
  handleChange: (val: { label: string; value: string }) => void;
}) => {
  const data = [
    { label: "All", value: "" },
    { label: "Mood", value: "mood" },
    { label: "Meds", value: "intake" },
  ];

  const [selectedValue, setSelectedValue] = useState(data[0]);

  return (
    <View className="flex-row justify-between space-x-4 items-center">
      <DropdownPicker
        data={data}
        selectedValue={selectedValue}
        handleChange={(item) => {
          setSelectedValue(item);
          handleChange(item);
        }}
        placeholder="Select activity type"
        renderLeftIcon={() => (
          <View className="mx-2">{/* Optional: Add an icon if needed */}</View>
        )}
      />
    </View>
  );
};

export default ActivityTypePicker;
