import { useEffect, useState } from "react";
import * as Geolocation from "expo-location";
import { LatLng } from "react-native-maps";
import { set } from "date-fns";

export const useLocation = () => {
  const [location, setLocation] = useState<LatLng>({
    latitude: 48.8583701,
    longitude: 2.2919064,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Geolocation.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Geolocation.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        let { status: bg } =
          await Geolocation.requestBackgroundPermissionsAsync();

        if (bg === "granted") {
          await Geolocation.watchPositionAsync(
            {
              accuracy: 6,
            },
            (location) => {
              console.log({ granted: location });
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
