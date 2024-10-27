import { useEffect, useState } from "react";
import * as Geolocation from "expo-location";
import { LatLng } from "react-native-maps";

export const useLocation = () => {
  const [location, setLocation] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Geolocation.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let { status: bg } =
          await Geolocation.requestBackgroundPermissionsAsync();
        if (bg === "granted") {
          await Geolocation.watchPositionAsync(
            {
              accuracy: 6,
            },
            (location) => {
              setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          );
        }
      }
    })();
  }, []);

  return { location, setLocation };
};
