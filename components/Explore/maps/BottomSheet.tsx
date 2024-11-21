"use client";

import React, { forwardRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import Handle from "@/components/Core/Handle";
import { LocationItem } from "./LocationItem";
import type { Place } from "@/types/global";

interface LocationListBottomSheetProps {
  index: SharedValue<number>;
  position: SharedValue<number>;
  data: Place[];
  onItemPress: (location: Place) => void;
  onEndReached: () => void;
  isLoadingMore?: boolean;
}

export const MIDDLE_SNAP_POINT = 500;

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
    const TAB_BAR_HEIGHT = 40;

    const snapPoints = useMemo(
      () => [TAB_BAR_HEIGHT + bottomSafeArea, MIDDLE_SNAP_POINT, "100%"],
      [TAB_BAR_HEIGHT, bottomSafeArea]
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
        snapPoints={snapPoints}
        topInset={headerHeight}
        animatedPosition={position}
        animatedIndex={index}
        backdropComponent={renderBackdrop}
        handleComponent={Handle}
        style={styles.bottomSheet}
      >
        <View style={styles.contentContainer}>
          {data.length > 0 ? (
            <>
              <View style={styles.header}>
                <Text className="font-fwbold text-center text-xl">
                  {data.length} Places
                </Text>
              </View>
              <BottomSheetFlashList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No places found</Text>
            </View>
          )}
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 250,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default LocationListBottomSheet;
