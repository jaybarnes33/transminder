import { icons } from "@/constants/icons";
import { colors } from "@/constants/onboarding";
import { ImageSourcePropType } from "react-native";

export interface Onboarding {
  image: ImageSourcePropType;
  subtitle: string;
  color: keyof typeof colors;
  line1: string;
  line2: string;
  description: string;
}

export type RequestConfig = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: any;
};

export type UseRequestResult<T> = {
  data: T | null;
  error: any;
  loading: boolean;
};

export interface ErrorObj {
  response: {
    data: {
      error: string;
      message: string;
    };
  };
  message: string;
}

export type Drug = {
  name: string;
  dosage: string;
  type: "pill" | "patch" | "injection" | "syrup";
  times: string[];
  notes: string;
  unit: string;
};

export type IconName = keyof typeof icons;

export type MoodLog = {
  mood: string;
  feelings: string[];
  notes: string;
  createdAt: string;
};
