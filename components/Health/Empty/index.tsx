import { View, Text, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import clsx from "clsx";

interface EmptyStateProps {
  image: ImageSourcePropType;
  heading: string;
  description: string;
  buttonLabel?: string;
  color?: string;
  buttonAction?: () => void;
}

const EmptyState = ({
  image,
  heading,
  description,
  buttonLabel,
  buttonAction,
  color = "bg-purple-500",
}: EmptyStateProps) => {
  return (
    <View className="bg-white px-4 py-2 shadow rounded-[20px] space-y-w mt-2">
      <View className="flex-row space-x-4 items-center">
        <Image source={image} />
        <View className="w-[70%] pr-8">
          <Text className="font-semibold text-base text-gray-400">
            {heading}
          </Text>
          <Text className="font-semibold text-base ">{description}</Text>
        </View>
      </View>

      {!!buttonLabel && (
        <>
          <Image
            source={require("@/assets/images/line.png")}
            className="w-full mt-2"
          />
          <TouchableOpacity
            onPress={buttonAction}
            className={clsx([
              "h-10 mx-auto mt-3 justify-center items-center rounded-full mb-2 w-3/5",
              color,
            ])}
          >
            <Text className="font-fwbold text-white">{buttonLabel}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default EmptyState;
