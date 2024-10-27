import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useUser } from "@/context/Auth";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useLocation } from "@/hooks/useLocation";

import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { LocationListBottomSheet } from "@/components/Explore/maps/BottomSheet";
import { useSharedValue } from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Location } from "@/types/global";
import Search from "@/components/Explore/maps/Search";
import { createLocationListMockData } from "@/utils/createMockData";

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

  const handleOnLocationPress = useCallback((item: Location) => {
    navigate({
      pathname: "/(app)/place-details",
      params: { place: JSON.stringify(item) },
    });
  }, []);

  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
  }, []);

  const data = createLocationListMockData(15);
  const [places, setPlaces] = useState<Location[]>(data);

  const search = (keyword: string) => {
    keyword.length > 0
      ? setPlaces(
          places.filter(
            (item) =>
              item.address.toLowerCase().includes(keyword.toLowerCase()) ||
              item.name.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      : setPlaces(data);
  };

  return (
    <View className="h-full">
      <View className="absolute px-4 top-20 left-0  z-[9999] w-full ">
        <Search search={search} />
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
      </MapView>

      <LocationListBottomSheet
        data={places}
        ref={poiListModalRef}
        index={animatedPOIListIndex}
        position={animatedPOIListPosition}
        onItemPress={handleOnLocationPress}
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
