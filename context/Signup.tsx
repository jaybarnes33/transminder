import axiosInstance from "@/lib/axios";
import { ErrorObj } from "@/types/global";
import { containsNumber, containsSymbol, isValidEmail } from "@/utils";
import { setTokens } from "@/utils/auth";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";
import { useUser } from "./Auth";
import { useBottomSheetModal } from "./BottomSheet";
import EditItem from "@/components/Settings/EditItem";
import { mutate } from "swr";
import { ImagePickerAsset } from "expo-image-picker";
import { registerForPushNotificationsAsync } from "@/utils/notification";

interface SignupPayload {
  email: string;
  name: string;
  otp: string;
  password: string;
  genderIdentity: string;
  allowNotifications: boolean;
  avatar: ImagePickerAsset;
  notificationToken: string;
}

interface SignUpContextValue {
  details: SignupPayload;
  handleChange: (
    key: string,
    value: string | boolean | ImagePickerAsset
  ) => void;
  step: number;
  next: () => void;
  isValid: (step: number) => boolean;
  back: () => void;
  submitting: boolean;
  message: string;
  setMessage: (message: string) => void;
  error: string;
  setError: (error: string) => void;
  continueFromOTP: () => void;
  resend: boolean;
}

const SignUpContext = createContext<SignUpContextValue>(
  {} as SignUpContextValue
);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [details, setDetails] = useState<SignupPayload>({} as SignupPayload);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [resend, setResend] = useState(false);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const { showModal } = useBottomSheetModal();

  const { navigate } = useRouter();
  const checkEmail = async () => {
    const { data } = await axiosInstance.post("/auth/check-email", {
      email: details.email,
    });
    setId(data.id);
  };
  const handleSignup = async () => {
    const formData = new FormData();

    //@ts-ignore
    formData.append("avatar", {
      uri: details?.avatar?.uri,
      type: details?.avatar?.type,
      name: details?.avatar?.fileName,
    });
    formData.append("email", details.email);
    formData.append("name", details.name);
    formData.append("password", details.password);
    formData.append("genderIdentity", details.genderIdentity);
    formData.append("notificationToken", details.notificationToken);
    formData.append(
      "allowNotifications",
      details.allowNotifications.toString()
    );

    const { data } = await axiosInstance.post(
      `/users?user=${id}`,

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    await Promise.all([
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }),
    ]);
    mutate("/auth", data.user);
    navigate("/(app)/(tabs)");
  };

  const verifyOTP = async () => {
    await axiosInstance.post("/auth/otp/verify", {
      email: details.email,
      otp: details.otp,
    });
  };
  const next = async () => {
    try {
      setSubmitting(true);
      if (step !== 8) {
        if (step === 1) {
          await checkEmail();
        }
        if (step === 2) {
          await verifyOTP();
        }
        if (step === 7) {
          handleChange("allowNotifications", true);
          const token = await registerForPushNotificationsAsync();
          if (token) {
            handleChange("notificationToken", token);
          }
        }
        setStep((prev) => prev + 1);
      } else {
        await handleSignup();
      }
    } catch (error: unknown) {
      setError(
        (error as ErrorObj).response?.data?.error ?? (error as ErrorObj).message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => {
    setStep((prev) => prev - 1);
  };

  const continueFromOTP = () => {
    setStep(2);
    setResend(true);
  };

  const handleChange = (
    key: string,
    value: string | boolean | ImagePickerAsset
  ) => {
    setMessage("");
    setError("");
    if (key === "genderIdentity" && value.toString().startsWith("Other")) {
      showModal(
        <EditItem
          name="gender"
          val=""
          title="How do you identify?"
          onChange={handleChange}
        />
      );
    }
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const validations: Record<number, boolean> = {
    1: isValidEmail(details?.email),
    2: details?.otp?.length === 6,
    3:
      details?.password?.length >= 8 &&
      containsNumber(details?.password) &&
      containsSymbol(details?.password),
    4: !!details?.name,
    5: true,
    6: true,
    7: true,
    8: true,
  };

  const isValid = (step: number) => {
    return validations[step];
  };

  return (
    <SignUpContext.Provider
      value={{
        details,
        step,
        next,
        isValid,
        handleChange,
        back,
        submitting,
        error,
        message,
        setMessage,
        setError,
        continueFromOTP,
        resend,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};
