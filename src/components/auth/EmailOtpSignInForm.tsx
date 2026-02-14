import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { haptic } from "@/lib/haptic";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function EmailOtpSignInForm() {
  const navigate = useNavigate();
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const emailSentTo = useAuthStore((s) => s.emailSentTo);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    haptic();
    authService.setAuthError(null);
    if (!email.trim()) {
      authService.setAuthError("Please enter your email.");
      return;
    }
    try {
      await authService.sendEmailOtp(email.trim());
    } catch {
      // Error already set in store
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    haptic();
    authService.setAuthError(null);
    const emailToUse = emailSentTo ?? email.trim();
    if (!emailToUse || !otp.trim()) {
      authService.setAuthError("Please enter the code from your email.");
      return;
    }
    try {
      await authService.verifyEmailOtp(emailToUse, otp.trim());
      navigate("/");
    } catch {
      // Error already set in store
    }
  };

  const handleBack = () => {
    haptic();
    authService.resetOtpState();
    setOtp("");
  };

  return (
    <div className="grid gap-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {!emailSentTo ? (
        <form onSubmit={handleSendOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email-otp-email">Email</Label>
            <Input
              id="email-otp-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending code…" : "Send login code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to <strong>{emailSentTo}</strong>
          </p>
          <div className="grid gap-2">
            <Label htmlFor="email-otp-code">Verification code</Label>
            <Input
              id="email-otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || otp.length < 6}>
              {isLoading ? "Verifying…" : "Verify"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
