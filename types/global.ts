import { eventColors } from "@/constants";
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

export interface DayObj {
  dayOfWeek: string;
  dayOfMonth: number;
  date: string;
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

export type DrugPayload = {
  name: string;
  dosage: string;
  start: string;
  type: "pill" | "patch" | "injection" | "syrup";
  times: string[];
  repeat: string;
  notes: string;
  unit: string;
  repeatFrequency?: number;
};

export interface Drug extends DrugPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  nextIntakeDate?: string;
  schedule: {
    day: string;
    repeat: "everyday" | "weekly" | "monthly" | "none";
    date?: number;
    frequency?: number;
  };
}

export interface Intake {
  _id: string;
  drug: Drug; // Reference to the Drug model
  type: string;
  drugName: string;
  dosage: string;
  time: string; // e.g., "14:00:00"
  createdAt: string;
  status: string;
  user: string; // Reference to the User model
  timestamp?: string;
}

export type IntakeStat = Pick<Intake, "createdAt" | "status">;

export type IconName = keyof typeof icons;

export type EventColor = keyof typeof eventColors;
export type MoodLog = {
  mood: string;
  feelings: string[];
  notes: string;
  date: string;
  createdAt: string;
};

export interface IEvent {
  name: string;
  _id: string;
  location: string;
  category: "health_check-in" | "milestones" | "community" | "event";
  note: string;
  date: string;
  repeats: string;
  start: string;
  end: string;
  user: string; // Refers to the user model
  createdAt: string;
}

export interface ActivityItem {
  _id: string;
  action: string;
  timestamp: string;
  intake?: Intake;
  mood?: MoodLog;
  event?: IEvent;
  drug?: Drug;
}

export interface Location {
  id: string;
  description: string;
  name: string;
  address: string;
  photos: string[];
  type: string;
  services: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  workingHours: {
    day: string;
    open: string;
    close: string;
  }[];
}
export interface Resource {
  _id: string;
  title: string;
  type: "article" | "guide" | "video";
  category: "health" | "community" | "support" | "legal" | "transition";
  description?: string;
  content?: string;
  steps?: string[];
  url?: string;
  author: string;
  datePublished: string;
  tags: string[];
  bookmarks: string[];
  thumbnail: string;
}

export interface Collection {
  _id: string;
  color: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  count: number;
  deleted: boolean;
}

interface WorkingHours {
  day: string;
  open: string;
  close: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
}

export interface Place {
  _id: string;
  photos: string[];
  name: string;
  type: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  services: string[];
  workingHours: WorkingHours[];
  address: {
    city: string;
    state: string;
    street: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  bookmarks: string[];
}

export interface Album {
  _id: string;
  name: string;
  media: { file: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}
