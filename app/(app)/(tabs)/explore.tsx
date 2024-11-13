import { View, Dimensions, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useUser } from "@/context/Auth";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import { LocationListBottomSheet } from "@/components/Explore/maps/BottomSheet";
import { useSharedValue } from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Place, PaginatedResponse } from "@/types/global";
import Search from "@/components/Explore/maps/Search";
import axiosInstance from "@/lib/axios";
import Message from "@/components/Core/Message";
import PlacesLoader from "@/components/Explore/Loaders/Places";

const PAGE_SIZE = 15;

const Explore = () => {
  const { hasMapsAccess } = useUser();
  const { navigate, replace } = useRouter();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  if (!hasMapsAccess) {
    return replace("/(app)/confirmmaps");
  }

  const mapRef = useRef<MapView>(null);
  const poiListModalRef = useRef<BottomSheetModal>(null);

  const animatedPOIListIndex = useSharedValue<number>(0);
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT);
  const { location } = useLocation();

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<Place[]> | null
  ) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `/places?page=${pageIndex + 1}&limit=${PAGE_SIZE}&latLng=${
      location.latitude
    },${location.longitude}`;
  };

  const fetcher = async (url: string) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Place[]>>(url);
    console.log({ data: JSON.stringify(data.data) });
    return data;
  };
  const { data, error, size, setSize, isLoading } = useSWRInfinite<
    PaginatedResponse<Place[]>
  >(getKey, fetcher);

  const [search, setSearch] = useState("");

  const places = useMemo(() => {
    const allPlaces = data ? data.flatMap((page) => page.data) : [];
    return allPlaces.filter(
      (place) =>
        place.name.toLowerCase().includes(search.toLowerCase()) ||
        place.address.street.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data.length === 0;
  const isReachingEnd =
    isEmpty ||
    (data &&
      data[data.length - 1]?.pagination.currentPage ===
        data[data.length - 1]?.pagination.totalPages);

  const handleOnLocationPress = useCallback((item: Place) => {
    navigate({
      pathname: "/(app)/place-details",
      params: { id: item._id },
    });
  }, []);

  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
  }, []);

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [isReachingEnd, isLoadingMore, setSize, size]);

  if (error) {
    return <Message isError message={error.message} />;
  }

  return (
    <View className="h-full">
      <View className="absolute px-4 top-20 left-0  z-[9999] w-full ">
        <Search search={setSearch} />
      </View>
      <MapView
        ref={mapRef}
        camera={{
          heading: 0,
          pitch: 0,
          zoom: 10,
          altitude: 1000,
          center: location,
        }}
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
      >
        {location && (
          <Marker coordinate={location}>
            <View className="h-5 w-5 rounded-full  border-4 border-white bg-blue-500 shadow"></View>
          </Marker>
        )}
        {places.map((place) => (
          <Marker
            key={place._id}
            coordinate={{
              latitude: place.location.latitude,
              longitude: place.location.longitude,
            }}
            title={place.name}
          />
        ))}
      </MapView>

      <LocationListBottomSheet
        data={places}
        ref={poiListModalRef}
        index={animatedPOIListIndex}
        position={animatedPOIListPosition}
        onItemPress={handleOnLocationPress}
        onEndReached={loadMore}
        isLoadingMore={isLoadingMore || isLoadingInitialData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Explore;
