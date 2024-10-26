import React, { forwardRef, useCallback, useMemo, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Handle from "@/components/Core/Handle";
import { LocationItem } from "./LocationItem";
import { Location } from "@/types/global";
import { createLocationListMockData } from "@/utils/createMockData";
import { View } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import Search from "./Search";
import clsx from "clsx";

interface LocationListBottomSheetProps {
  index: SharedValue<number>;
  position: SharedValue<number>;
  data: Location[];
  onItemPress: (location: Location) => void;
}

export const MIDDLE_SNAP_POINT = 300;

export const LocationListBottomSheet = forwardRef<
  BottomSheetModal,
  LocationListBottomSheetProps
>(({ index, position, onItemPress, data }, ref) => {
  //#region hooks
  const headerHeight = useHeaderHeight();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 40; // Set this to your tab bar’s actual height
  const [showSearch, setShowSearch] = useState(false);
  const SNAP_POINTS = [
    TAB_BAR_HEIGHT + bottomSafeArea, // This ensures the bottom sheet starts just above the tab bar
    MIDDLE_SNAP_POINT,
    "100%",
  ];

  //#endregion

  //#region styles
  const scrollViewAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: index.value,
    }),
    [index.value]
  );
  const scrollViewStyle = useMemo(
    () => [styles.scrollView, scrollViewAnimatedStyle],
    [scrollViewAnimatedStyle]
  );
  const scrollViewContentContainer = useMemo(
    () => [
      styles.scrollViewContentContainer, // Adjust padding to match tab bar height
      ,
    ],
    []
  );
  //#endregion

  //#region render
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        pressBehavior="none"
        appearsOnIndex={2}
        disappearsOnIndex={1}
      />
    ),
    []
  );

  const renderItem = useCallback(
    (item: Location, index: number) => (
      <TouchableOpacity
        key={`${item.name}.${index}`}
        onPress={() => onItemPress(item)}
      >
        <LocationItem location={item} />
      </TouchableOpacity>
    ),
    [onItemPress]
  );

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={SNAP_POINTS}
      topInset={headerHeight}
      animatedPosition={position}
      animatedIndex={index}
      onChange={(index) => {
        index === 2 ? setShowSearch(true) : setShowSearch(false);
      }}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
    >
      {data.length > 0 ? (
        <>
          <View className="mt-10 mb-4 ">
            <Text
              className={clsx([
                "text-center font-fwbold text-xl hidden",
                !showSearch && "flex",
              ])}
            >
              {data?.length} Places
            </Text>
          </View>
          <BottomSheetScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="never"
            style={scrollViewStyle}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: showSearch ? 100 : 10,
            }}
          >
            {data?.map(renderItem)}
          </BottomSheetScrollView>
        </>
      ) : (
        <View className="my-5">
          <Text className="font-main text-xl text-center">No places found</Text>
        </View>
      )}
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },
});
