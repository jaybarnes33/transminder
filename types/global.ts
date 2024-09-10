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
