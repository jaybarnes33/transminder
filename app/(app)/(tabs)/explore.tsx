import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import useSWRInfinite from "swr/infinite";
import { useUser } from "@/context/Auth";
import { useFocusEffect, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";
import { LocationListBottomSheet } from "@/components/Explore/maps/BottomSheet";
import { useSharedValue } from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Place, PaginatedResponse } from "@/types/global";
import Search from "@/components/Explore/maps/Search";
import axiosInstance from "@/lib/axios";
import Message from "@/components/Core/Message";
import { FlashList } from "@shopify/flash-list";
import Emoji from "@/components/Core/Emoji";
import clsx from "clsx";
import useSWR from "swr";

const PAGE_SIZE = 15;

const categories = [
  { name: "saved", fore: "#000000", bg: "white" },
  { name: "support", fore: "#24B2FF", bg: "white" },
  { name: "healthcare", fore: "#4DCFFF", bg: "white" },
  { name: "social", fore: "#F5673E", bg: "white" },
  { name: "wellness", fore: "#F7CD1B", bg: "white" },
  { name: "shopping", fore: "#B85ADF", bg: "white" },
  { name: "housing", fore: "#F87171", bg: "white" },
  { name: "services", fore: "#6B7280", bg: "white" },
  { name: "education", fore: "#46C17E", bg: "white" },
];

const CategoryButton = React.memo(
  ({
    item,
    isSelected,
    onPress,
  }: {
    item: (typeof categories)[number];
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={clsx([
        "px-3 py-2 flex-row gap-x-2 items-center  rounded shadow border mr-3",
        isSelected ? "bg-rose-100 border-gray-300" : "bg-white border-gray-200",
      ])}
      style={{
        transform: [{ scale: isSelected ? 1.05 : 1 }],
      }}
    >
      <Emoji
        name={item.name === "saved" ? "bookmark-active" : item.name}
        fore={item.fore}
        size="sm"
      />
      <Text
        className={clsx([
          "font-semibold capitalize",
          isSelected ? "text-gray-900" : "text-gray-700",
        ])}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )
);

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

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<Place[]> | null
  ) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `/places?page=${pageIndex + 1}&limit=${PAGE_SIZE}&latLng=${
      location.latitude
    },${location.longitude}&search=${search}&type=${category}`;
  };

  const fetcher = async (url: string) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Place[]>>(url);
    return data;
  };

  const { data, error, size, setSize, isLoading, mutate } = useSWRInfinite<
    PaginatedResponse<Place[]>
  >(getKey, fetcher);

  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [mutate])
  );

  const fetchPlaces = async () => {
    const { data } = await axiosInstance.get(
      `/places/all?latLng=${location.latitude},${location.longitude}&search=${search}&type=${category}`
    );
    return data.places;
  };

  const { data: allPlaces, mutate: mutatePlaces } = useSWR<
    {
      name: string;
      description: string;
      type: string;
      _id: string;
      location: { latitude: number; longitude: number };
    }[]
  >("/places/all", fetchPlaces);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: location,
        zoom: 10,
      });
    }
  }, [location]);

  useEffect(() => {
    mutatePlaces();
  }, [category, search, mutatePlaces]);

  useEffect(() => {
    console.log("Current category:", category);
  }, [category]);

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

  const handleOnLocationPress = useCallback(
    (item: Place) => {
      navigate({
        pathname: "/(app)/place-details",
        params: { id: item._id },
      });
    },
    [navigate]
  );

  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
  }, []);

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleCategoryPress = useCallback((value: string) => {
    setCategory((prevCategory) => {
      const newCategory = prevCategory === value ? "" : value;
      console.log("Category changed to:", newCategory);
      return newCategory;
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [isReachingEnd, isLoadingMore, setSize]);

  if (error) {
    return <Message isError message={error.message} />;
  }

  return (
    <View className="h-full">
      <View className="absolute px-4 top-20 left-0 z-[9999] w-full">
        <Search
          clear={() => setSearch("")}
          placeholder="Explore places"
          search={setSearch}
          term={search}
        />
        <FlashList
          className="h-12 -mt-2"
          data={categories}
          horizontal
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <CategoryButton
              item={item}
              isSelected={category === item.name}
              onPress={() => handleCategoryPress(item.name)}
            />
          )}
          extraData={category}
        />
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
        onPress={handleMapPress}
      >
        {location && (
          <Marker coordinate={location}>
            <View className="h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow" />
          </Marker>
        )}
        {allPlaces &&
          allPlaces.length > 0 &&
          allPlaces.map((place) => (
            <Marker
              key={place._id}
              coordinate={{
                latitude: place.location.latitude,
                longitude: place.location.longitude,
              }}
              title={place.name}
            >
              <View
                style={{
                  backgroundColor: categories.find(
                    (item) => item.name === place.type
                  )?.fore,
                  borderRadius: 999,
                  padding: 4,
                  borderWidth: 2,
                  borderColor: categories.find(
                    (item) => item.name === place.type
                  )?.bg,
                }}
              >
                <Emoji
                  name={place.type}
                  fore={categories.find((item) => item.name === place.type)?.bg}
                  bg={categories.find((item) => item.name === place.type)?.fore}
                />
              </View>
            </Marker>
          ))}
      </MapView>

      {places.length > 0 ? (
        <LocationListBottomSheet
          data={places}
          category={category}
          ref={poiListModalRef}
          index={animatedPOIListIndex}
          position={animatedPOIListPosition}
          onItemPress={handleOnLocationPress}
          onEndReached={loadMore}
          isLoadingMore={isLoadingMore || isLoadingInitialData}
        />
      ) : (
        <View className="absolute bg-white rounded bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Text className="text-lg text-neutral-600 font-semibold text-center">
            No places found
          </Text>
        </View>
      )}
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
