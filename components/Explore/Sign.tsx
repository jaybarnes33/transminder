import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
import { useRef } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

const Sign = ({
  text,
  onOK,
  sign,
}: {
  sign: string;
  text: string;
  onOK: (s: string) => void;
}) => {
  const ref = useRef<SignatureViewRef | null>(null);

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature: string) => {
    onOK(signature); // Callback from Component props
  };
  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref?.current?.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data: any) => {
    console.log(data);
  };
  const disabled = sign.length <= 0;
  const imgWidth = Dimensions.get("window").width - 16;
  const imgHeight = 200;
  const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;

  return (
    <View className="mt-auto space-y-2">
      <Text className="font-semibold text-xs ml-4">{text}</Text>
      <View
        className="shadow-xl relative mt-auto flex-row items-center rounded-3xl overflow-hidden  bg-white"
        style={{ width: imgWidth, height: imgHeight }}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={() => ref?.current?.clearSignature()}
          className={clsx(["ml-4 "])}
        >
          <Feather name="x" size={24} color={disabled ? "white" : "gray"} />
        </TouchableOpacity>

        <SignatureScreen
          ref={ref}
          onEnd={handleEnd}
          onOK={handleOK}
          onEmpty={handleEmpty}
          onGetData={handleData}
          webStyle={style}
          onClear={() => onOK("")}
        />
      </View>
    </View>
  );
};

export default Sign;
