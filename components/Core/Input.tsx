import { View, Text, TextInput, TextInputProps } from "react-native";
import React from "react";
import { clsx } from "clsx";

const Input = (props: TextInputProps & { name?: string }) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <View className="space-y-1">
      {props.name && (
        <Text className="font-main font-semibold text-neutral-600 text-center text-sm">
          {props.name}
        </Text>
      )}
      <TextInput
        {...props}
        className={clsx([
          "h-12 bg-neutral-200 px-3  rounded-xl font-main font-semibold",
          focus && " border-2 border-ring ",
        ])}
        placeholderTextColor={"gray"}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </View>
  );
};

export default Input;
