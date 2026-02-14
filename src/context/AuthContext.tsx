import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth, authReady } from "@/lib/firebase";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

/** User from Firebase or synthetic user from backend email-OTP login */
export type AppUser = User | BackendAppUser;

export interface BackendAppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

function backendAppUser(email: string): BackendAppUser {
  return {
    uid: `backend-${email}`,
    email,
    displayName: null,
    photoURL: null,
  }
}

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Single promise for redirect result so React Strict Mode / double-mount doesn't consume it twice.
let redirectResultPromise: Promise<unknown> | null = null;
function getRedirectResultOnce() {
  if (redirectResultPromise === null) {
    redirectResultPromise = getRedirectResult(auth);
  }
  return redirectResultPromise;
}

// Allow time for getRedirectResult to complete after redirect (mobile can be slow).
const REDIRECT_RESULT_TIMEOUT_MS = 15_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const backendSession = useAuthStore((s) => s.backendSession);

  // Hydrate backend session from localStorage on mount (token only)
  useEffect(() => {
    authService.hydrateFromStorage();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    const setStateFromAuth = (u: User | null) => {
      if (!cancelled) {
        setFirebaseUser(u);
        setLoading(false);
      }
    };

    (async () => {
      try {
        await authReady;
      } catch (e) {
        console.warn("Auth persistence failed:", e);
      }
      if (cancelled) return;

      try {
        await Promise.race([
          getRedirectResultOnce(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), REDIRECT_RESULT_TIMEOUT_MS)
          ),
        ]);
      } catch (e) {
        // No redirect pending or timeout (common on first load or slow mobile).
        if (e instanceof Error && e.message !== "timeout") {
          console.warn("getRedirectResult error:", e);
        }
      }
      if (cancelled) return;

      if (auth.currentUser) {
        setStateFromAuth(auth.currentUser);
      }

      unsubscribe = onAuthStateChanged(auth, setStateFromAuth);
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const user: AppUser | null =
    firebaseUser ??
    (backendSession ? backendAppUser(backendSession.email) : null);

  const signOut = useCallback(async () => {
    if (firebaseUser) {
      const { signOut: firebaseSignOut } = await import("firebase/auth");
      await firebaseSignOut(auth);
    } else if (backendSession) {
      authService.clearBackendSession();
    }
  }, [firebaseUser, backendSession]);

  const deleteAccount = useCallback(async () => {
    const { deleteUser } = await import("firebase/auth");
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    await deleteUser(currentUser);
  }, []);

  const value: AuthContextValue = { user, loading, signOut, deleteAccount };

  // Sync backend session from store into context when it's set after verify
  useEffect(() => {
    if (backendSession && !firebaseUser) {
      setLoading(false);
    }
  }, [backendSession, firebaseUser]);

  // Fetch user profile on load when logged in with backend token
  useEffect(() => {
    if (!backendSession || firebaseUser) return;
    authService.getUserProfile().catch(() => {
      // Token may be expired or invalid; ignore, user can sign in again
    });
  }, [backendSession, firebaseUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
