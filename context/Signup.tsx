import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";

interface SignupPayload {
  email: string;
  name: string;
  otp: string;
  password: string;
  genderIdentity: string;
  allowNotifications: boolean;
  avatar: string;
}

interface SignUpContextValue {
  details: SignupPayload;
  handleChange: (key: string, value: string | boolean) => void;
  step: number;
  next: () => void;
  isValid: (step: number) => boolean;
  back: () => void;
}

const SignUpContext = createContext<SignUpContextValue>(
  {} as SignUpContextValue
);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [details, setDetails] = useState<SignupPayload>({} as SignupPayload);
  const [step, setStep] = useState(1);
  const { navigate } = useRouter();
  const next = () => {
    if (step !== 8) {
      if (step === 7) {
        handleChange("allowNotifications", true);
      }
      setStep((prev) => prev + 1);
    } else {
      console.log(details);
      navigate("/(tabs)");
    }
  };

  const back = () => {
    setStep((prev) => prev - 1);
  };

  const handleChange = (key: string, value: string | boolean) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const validations: Record<number, boolean> = {
    1: !!details?.email,
    2: !!details?.otp,
    3: !!details?.password,
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
      value={{ details, step, next, isValid, handleChange, back }}
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
