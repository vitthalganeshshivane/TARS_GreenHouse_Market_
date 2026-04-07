import AuthShell from "@/components/auth/AuthShell";
import AuthNavbar from "@/components/auth/AuthNavbar";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthCard from "@/components/auth/AuthCard";
import OTPInput from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();

  const handleOTPChange = (otp) => {
    console.log("OTP:", otp);
  };

  return (
    <AuthShell>
      <AuthNavbar />

      <main className="flex flex-col items-center px-4 py-8 sm:px-6 md:py-12">
        <div className="w-full max-w-[560px]">
          <AuthCard
            title="Verify Your Account"
            description="Enter the 6-digit code sent to your email to continue securely."
          >
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
              </div>

              <OTPInput length={6} onChange={handleOTPChange} />

              <Button
                className="mt-1 h-12 w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 text-base font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:opacity-95 sm:h-[52px]"
                onClick={() => navigate("/success")}
              >
                Verify
              </Button>
            </div>
          </AuthCard>
        </div>

        <AuthFooter compact />
      </main>
    </AuthShell>
  );
}