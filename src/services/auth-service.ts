import { apiCall, apiCallWithAuth } from "@/apiActions/api-actions";
import { base_url, endpoints } from "@/apiActions/environment";
import {
  clearStoredBackendSession,
  getStoredToken,
  setStoredToken,
  useAuthStore,
} from "@/store/auth-store";
import type {
  GetUserProfileResponse,
  SendEmailOtpRequest,
  SendEmailOtpResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  UserProfile,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
} from "@/types/auth";

interface IAuthService {
  readonly sendEmailOtp: (email: string) => Promise<void>;
  readonly verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  readonly resetOtpState: () => void;
  readonly setAuthError: (error: string | null) => void;
  readonly clearBackendSession: () => void;
  /** Restore backend session from token in localStorage (e.g. on app load). */
  readonly hydrateFromStorage: () => void;
  /** Fetch current user profile (requires auth token). */
  readonly getUserProfile: () => Promise<UserProfile | null>;
  /** Update current user profile (requires auth token). */
  readonly updateUserProfile: (
    payload: UpdateUserProfileRequest,
  ) => Promise<UserProfile | null>;
}

class AuthService implements IAuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async sendEmailOtp(email: string): Promise<void> {
    useAuthStore.setState({ isLoading: true, error: null });
    const url = base_url + endpoints.send_email_otp;
    try {
      const body: SendEmailOtpRequest = { email: email.trim() };
      const response = await apiCall<
        SendEmailOtpResponse,
        undefined,
        SendEmailOtpRequest
      >("POST", url, undefined, body);
      if (response.success) {
        useAuthStore.setState({ emailSentTo: email.trim() });
      } else {
        useAuthStore.setState({
          error: response.message ?? "Failed to send OTP",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send OTP";
      useAuthStore.setState({ error: message });
      throw error;
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  }

  public async verifyEmailOtp(email: string, otp: string): Promise<void> {
    useAuthStore.setState({ isLoading: true, error: null });
    const url = base_url + endpoints.verify_email_otp;
    try {
      const body: VerifyEmailOtpRequest = {
        email: email.trim(),
        otp: otp.trim(),
      };
      const response = await apiCall<
        VerifyEmailOtpResponse,
        undefined,
        VerifyEmailOtpRequest
      >("POST", url, undefined, body);
      if (response.success && response.token) {
        setStoredToken(response.token);
        useAuthStore.setState({
          backendSession: { email: email.trim(), token: response.token },
        });
      } else {
        const message = response.message ?? "Verification failed";
        useAuthStore.setState({ error: message });
        throw new Error(message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification failed";
      useAuthStore.setState({ error: message });
      throw error;
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  }

  public resetOtpState(): void {
    useAuthStore.setState({ emailSentTo: null, error: null });
  }

  public setAuthError(error: string | null): void {
    useAuthStore.setState({ error });
  }

  public clearBackendSession(): void {
    clearStoredBackendSession();
    useAuthStore.setState({ backendSession: null, userProfile: null });
  }

  public hydrateFromStorage(): void {
    const token = getStoredToken();
    if (token) {
      useAuthStore.setState({ backendSession: { email: "", token } });
    }
  }

  public async getUserProfile(): Promise<UserProfile | null> {
    useAuthStore.setState({ profileLoading: true });
    const url = base_url + endpoints.get_user_profile;
    try {
      const response = await apiCallWithAuth<
        GetUserProfileResponse,
        undefined,
        undefined
      >("GET", url);
      const profile = response.success ? (response.user ?? null) : null;
      if (profile) {
        useAuthStore.setState({ userProfile: profile, profileLoading: false });
        return profile;
      }
      useAuthStore.setState({ profileLoading: false });
      return null;
    } catch (error) {
      useAuthStore.setState({ profileLoading: false });
      throw error;
    }
  }

  public async updateUserProfile(
    payload: UpdateUserProfileRequest,
  ): Promise<UserProfile | null> {
    const url = base_url + endpoints.update_user_profile;
    const response = await apiCallWithAuth<
      UpdateUserProfileResponse,
      undefined,
      UpdateUserProfileRequest
    >("PUT", url, undefined, payload);
    const profile = response.success ? (response.user ?? null) : null;
    if (profile) {
      useAuthStore.setState({ userProfile: profile });
      return profile;
    }
    return null;
  }
}

export const authService = AuthService.getInstance();
