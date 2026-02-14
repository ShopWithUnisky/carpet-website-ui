import type { BackendSession, UserProfile } from "@/types/auth";
import { create } from "zustand";

const TOKEN_KEY = "token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearStoredBackendSession(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

interface AuthStore {
  isLoading: boolean;
  error: string | null;
  /** Email we sent OTP to (for showing "Enter code sent to ...") */
  emailSentTo: string | null;
  /** Set when user logs in via email OTP (token stored in localStorage) */
  backendSession: BackendSession | null;
  /** User profile from GET /users/profile (when logged in with token) */
  userProfile: UserProfile | null;
  profileLoading: boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  isLoading: false,
  error: null,
  emailSentTo: null,
  backendSession: null,
  userProfile: null,
  profileLoading: false,
}));
