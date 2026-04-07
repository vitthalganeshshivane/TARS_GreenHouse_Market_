import { useState } from "react";
import OTPInput from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X } from "lucide-react";

export default function OTPVerificationModal({ isOpen, onClose, onVerify, email }) {
  const [otp, setOtp] = useState("");

  const handleOTPChange = (value) => {
    setOtp(value);
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      // Simulate OTP verification (in real app, call API)
      console.log("OTP Verified:", otp);
      onVerify();
      setOtp("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-6">
      <div className="w-full max-w-[560px] rounded-3xl bg-white shadow-2xl">
        <div className="relative flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8 sm:py-6">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Verify Your Email</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
            </div>
            <p className="mt-4 text-sm text-slate-600 sm:text-[15px]">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-slate-900">{email}</span>
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-center text-sm font-semibold text-slate-700 mb-3">
                Enter OTP Code
              </label>
              <OTPInput length={6} onChange={handleOTPChange} />
            </div>

            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6}
              className="h-12 w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 text-base font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed sm:h-[52px]"
            >
              Verify Email
            </Button>

            <p className="text-center text-xs text-slate-500 sm:text-sm">
              Didn't receive the code?{" "}
              <button className="font-semibold text-emerald-700 hover:underline">
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
