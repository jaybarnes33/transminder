export interface LoginPayload {
  email: string;
  password: string;
}

type TokenError = {
  error: any;
};
export interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface User {
  id: string;
  _id: string;
  email: string;
  name: string;
  otp: string;
  password: string;
  genderIdentity: string;
  allowNotifications: boolean;
  timezone: string;
  avatar: string;
  age: string;
  googleId?: string;
  notificationTokens: string[];
  country: string;
  hasMapsAccess: boolean;
}
