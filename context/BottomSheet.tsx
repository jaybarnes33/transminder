import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider as GorhomBottomSheetModalProvider,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import Handle from "@/components/Core/Handle";

type BottomSheetModalContextType = {
  showModal: (content: React.ReactNode) => void;
  dismissModal: () => void;
  setItem: (content: React.ReactNode) => void;
};

const BottomSheetModalContext = createContext<
  BottomSheetModalContextType | undefined
>(undefined);

export const BottomSheetModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["70%", "75%"], []);

  const showModal = useCallback((content: React.ReactNode) => {
    Keyboard.dismiss();
    setContent(content);
    bottomSheetModalRef.current?.present();
  }, []);

  const setItem = useCallback((content: React.ReactNode) => {
    setContent(content);
  }, []);

  const dismissModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setContent(null);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} opacity={0.5} />
    ),
    []
  );

  const handleSheetChange = useCallback((index: number) => {
    Keyboard.dismiss();
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalContext.Provider
        value={{ showModal, dismissModal, setItem }}
      >
        <GorhomBottomSheetModalProvider>
          {children}
          <BottomSheetModal
            handleComponent={Handle}
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            enableDismissOnClose
            enablePanDownToClose
            onDismiss={dismissModal}
            backdropComponent={renderBackdrop}
          >
            <BottomSheetView>{content}</BottomSheetView>
          </BottomSheetModal>
        </GorhomBottomSheetModalProvider>
      </BottomSheetModalContext.Provider>
    </GestureHandlerRootView>
  );
};

export const useBottomSheetModal = (): BottomSheetModalContextType => {
  const context = useContext(BottomSheetModalContext);
  if (context === undefined) {
    throw new Error(
      "useBottomSheetModal must be used within a BottomSheetModalProvider"
    );
  }
  return context;
};
