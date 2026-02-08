import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ConfirmationResult } from "firebase/auth";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type RecaptchaVerifier as RecaptchaVerifierType,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { haptic } from "@/lib/haptic";

function getPhoneAuthErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid phone number. Include country code (e.g. +91 9876543210).";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/invalid-verification-code":
      return "Invalid or expired code. Please request a new one.";
    case "auth/code-expired":
      return "Code expired. Please request a new one.";
    case "auth/captcha-check-failed":
      return "Verification failed. Please try again.";
    case "auth/missing-client-identifier":
      return "Browser not supported for phone sign-in.";
    default:
      return "Phone sign-in failed. Please try again.";
  }
}

export function PhoneSignInForm() {
  const navigate = useNavigate();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifierType | null>(null);

  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ensureRecaptcha = () => {
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
    if (!recaptchaContainerRef.current) throw new Error("reCAPTCHA container not ready");
    const verifier = new RecaptchaVerifier(
      auth,
      recaptchaContainerRef.current,
      {
        size: "invisible",
        callback: () => {},
      }
    );
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    haptic();
    setError("");
    const raw = phone.trim().replace(/\s/g, "");
    if (!raw) {
      setError("Enter your phone number with country code (e.g. +91 9876543210).");
      return;
    }
    setLoading(true);
    try {
      const verifier = ensureRecaptcha();
      const result = await signInWithPhoneNumber(auth, raw, verifier);
      setConfirmationResult(result);
      setOtp("");
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      setError(getPhoneAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    haptic();
    setError("");
    if (!confirmationResult || !otp.trim()) {
      setError("Enter the 6-digit code sent to your phone.");
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(otp.trim());
      navigate("/");
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      setError(getPhoneAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    haptic();
    setConfirmationResult(null);
    setOtp("");
    setError("");
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = null;
  };

  return (
    <div className="grid gap-4">
      <div ref={recaptchaContainerRef} id="recaptcha-container" className="hidden" aria-hidden />

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {!confirmationResult ? (
        <form onSubmit={handleSendCode} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g. +91 for India)
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send verification code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to {phone.trim().replace(/\s/g, "")}
          </p>
          <div className="grid gap-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              autoComplete="one-time-code"
              disabled={loading}
              className="text-center text-lg tracking-widest"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying…" : "Verify"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
