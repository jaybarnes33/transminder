import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Handle from "@/components/Core/Handle";
import { LocationItem } from "./LocationItem";
import { Place } from "@/types/global";
import { View } from "@/components/Themed";
import clsx from "clsx";
import { FlashList } from "@shopify/flash-list";

interface LocationListBottomSheetProps {
  index: SharedValue<number>;
  position: SharedValue<number>;
  data: Place[];
  onItemPress: (location: Place) => void;
  onEndReached: () => void;
  isLoadingMore?: boolean;
}

export const MIDDLE_SNAP_POINT = 300;

export const LocationListBottomSheet = forwardRef<
  BottomSheetModal,
  LocationListBottomSheetProps
>(
  (
    { index, position, onItemPress, data, onEndReached, isLoadingMore },
    ref
  ) => {
    const headerHeight = useHeaderHeight();
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const TAB_BAR_HEIGHT = 40; // Set this to your tab bar's actual height
    const [showSearch, setShowSearch] = useState(false);
    const SNAP_POINTS = [
      TAB_BAR_HEIGHT + bottomSafeArea,
      MIDDLE_SNAP_POINT,
      "100%",
    ];

    const scrollViewAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: index.value,
      }),
      [index]
    );

    const scrollViewStyle = useMemo(
      () => [styles.scrollView, scrollViewAnimatedStyle],
      [scrollViewAnimatedStyle]
    );

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
      ({ item }: { item: Place }) => (
        <TouchableOpacity onPress={() => onItemPress(item)}>
          <LocationItem location={item} />
        </TouchableOpacity>
      ),
      [onItemPress]
    );

    const renderFooter = useCallback(() => {
      if (!isLoadingMore) return null;
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }, [isLoadingMore]);

    return (
      <BottomSheet
        ref={ref}
        index={1}
        snapPoints={SNAP_POINTS}
        topInset={headerHeight}
        animatedPosition={position}
        animatedIndex={index}
        onChange={(index) => {
          setShowSearch(index === 2);
        }}
        backdropComponent={renderBackdrop}
        handleComponent={Handle}
      >
        {data.length > 0 ? (
          <>
            <View className="mt-10 mb-4">
              <Text
                className={clsx([
                  "text-center font-fwbold text-xl hidden",
                  !showSearch && "flex",
                ])}
              >
                {data.length} Places
              </Text>
            </View>
            <FlashList
              data={data}
              estimatedItemSize={10}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: showSearch ? 100 : 10,
              }}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          </>
        ) : (
          <View className="my-5">
            <Text className="font-main text-xl text-center">
              No places found
            </Text>
          </View>
        )}
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default LocationListBottomSheet;
