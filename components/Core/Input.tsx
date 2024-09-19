import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { clsx } from "clsx";
import { Feather, FontAwesome6 } from "@expo/vector-icons";

const Input = (props: TextInputProps & { name?: string }) => {
  const [focus, setFocus] = React.useState(false);
  const [secure, setSecure] = React.useState(props.secureTextEntry || false);
  const inputRef = React.useRef<TextInput>(null);
  return (
    <View className="space-y-1 my-2">
      {props.name && (
        <Text className="font-main font-semibold text-neutral-600 text-center text-sm">
          {props.name}
        </Text>
      )}
      <View
        className={clsx([
          "h-12 justify-center bg-neutral-200   rounded-xl font-main font-semibold w-full",
          focus && " border-2 border-ring ",
        ])}
      >
        <TextInput
          {...props}
          ref={inputRef}
          className="flex-1  h-full w-full absolute px-3 font-main font-semibold"
          placeholderTextColor={"gray"}
          secureTextEntry={secure}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {props.secureTextEntry && (
          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            className="absolute right-0 h-full items-center justify-center w-12"
          >
            <Feather
              name={secure ? "eye" : "eye-off"}
              size={20}
              color={"black"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
