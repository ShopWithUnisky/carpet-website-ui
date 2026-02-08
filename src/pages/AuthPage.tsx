import { PhoneSignInForm } from "@/components/auth/PhoneSignInForm";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { auth } from "@/lib/firebase";
import { haptic } from "@/lib/haptic";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function getGoogleAuthErrorMessage(
  code: string,
  usedRedirect: boolean,
): string {
  switch (code) {
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    case "auth/cancelled-popup-request":
      return "";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email using another sign-in method.";
    case "auth/popup-blocked":
      return "Popup was blocked. Please allow popups for this site.";
    case "auth/redirect-cancelled-by-user":
      return "Sign-in was cancelled.";
    case "auth/unauthorized-domain":
      const host =
        typeof window !== "undefined" ? window.location.hostname : "";
      return host
        ? `This domain (${host}) is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.`
        : "This domain is not authorized for sign-in. Add your app's domain in Firebase Console → Authentication → Settings → Authorized domains.";
    default:
      return usedRedirect
        ? "Redirect sign-in failed. Try again or use email/password."
        : "Sign in with Google failed. Please try again.";
  }
}

export function AuthPage() {
  useDocumentTitle("Sign in | Carpet Company");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center bg-linear-to-b from-muted/30 to-background">
        <p className="text-muted-foreground">Signing you in…</p>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    haptic();
    setGoogleError("");
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Prefer popup everywhere: it avoids third-party storage blocking on mobile (Safari/Chrome).
      // Fall back to redirect only when popup is blocked or fails.
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code: string }).code
          : "";
      const useRedirect =
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/popup-closed-by-user";

      if (useRedirect) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch {
          setGoogleError(
            "Sign-in failed. On mobile, try using Chrome or ensure this site is in your allowed list."
          );
        }
      } else {
        const message = getGoogleAuthErrorMessage(code, true);
        if (message) setGoogleError(message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center px-4 py-16">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <svg className="mr-2 size-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? "Signing in…" : "Continue with Google"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="phone" className="mt-0">
              <PhoneSignInForm />
            </TabsContent>
            <TabsContent value="signin" className="mt-6">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <SignUpForm />
            </TabsContent>
          </Tabs>

          {googleError && (
            <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {googleError}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
