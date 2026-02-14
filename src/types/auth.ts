export interface SendEmailOtpRequest {
  email: string;
}

export interface SendEmailOtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailOtpResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface BackendSession {
  email: string;
  token: string;
}

export interface UserProfileAddress {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  isVerified?: boolean;
  name?: string;
  phoneNumber?: string;
  address?: UserProfileAddress;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUserProfileResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
  code?: string;
  statusCode?: number;
}
