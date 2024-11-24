import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import React from "react";

import clsx from "clsx";

interface EmptyStateProps {
  image?: ImageSourcePropType;
  heading: string;
  description: string;
  buttonLabel?: string;
  color?: string;
  buttonAction?: () => void;
}

const EmptyState = ({
  image = require("@/assets/images/calendar-empty.png"),
  heading,
  description,
  buttonLabel,
  buttonAction,
  color = "bg-purple-500",
}: EmptyStateProps) => {
  return (
    <View className="bg-white m-1 px-4 py-2 shadow rounded-[20px] gap-y-w mt-2">
      <View className="flex-row gap-x-4 items-center">
        <Image source={image} />
        <View className="w-[70%] pr-8">
          <Text className="font-semibold text-base text-gray-400">
            {heading}
          </Text>
          <Text className="font-semibold text-base ">{description}</Text>
        </View>
      </View>

      {buttonLabel?.length && (
        <View>
          <Image
            source={require("@/assets/images/line.png")}
            className="w-full mt-2"
          />
          <TouchableOpacity
            onPress={buttonAction}
            className={clsx([
              "h-10 mx-auto mt-3 justify-center bg-purple-500 items-center rounded-full mb-2 w-3/5",
            ])}
          >
            <Text className="font-fwbold text-white">{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EmptyState;
