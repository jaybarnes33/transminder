import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useUser } from "@/context/Auth";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export default function AppLayout() {
  const { user, loading } = useUser();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (loading) {
    console.log("Loading");
    console.log("User", user);
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  useEffect(() => {
    console.log("User", user);
  }, [user]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    <>
      <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
