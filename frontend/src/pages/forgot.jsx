import AuthShell from "@/components/auth/AuthShell";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthNavbar from "@/components/auth/AuthNavbar";
import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <AuthShell>
      <AuthNavbar />

      <main className="flex flex-col items-center px-4 py-7 sm:px-6 md:py-10">
        <div className="relative w-full max-w-[560px]">
          <div className="absolute left-6 top-0 z-20 hidden -translate-y-1/2 rotate-[10deg] sm:block">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop"
              alt="Herbs"
              className="h-32 w-32 rounded-3xl object-cover shadow-xl"
            />
          </div>

          <AuthCard
            title="Forgot Password"
            description="Enter your registered email address to receive a reset code"
            className="pt-6 sm:pt-8"
          >
            <div className="mb-6 flex items-center gap-2 sm:gap-3">
              <div className="h-1.5 w-16 rounded-full bg-emerald-700" />
              <div className="h-1.5 w-16 rounded-full bg-slate-200" />
              <div className="h-1.5 w-16 rounded-full bg-slate-200" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-800 sm:text-sm">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <Input
                  placeholder="name@example.com"
                  className="h-12 rounded-xl border-slate-200 pl-10 text-sm sm:text-base"
                />
              </div>
            </div>

            <Button
              className="mt-7 h-12 w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 text-base font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:opacity-95 sm:h-[52px]"
              onClick={() => navigate("/verify")}
            >
              Send Reset Link
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Link
              to="/login"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-700 hover:text-emerald-700 sm:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-emerald-50 p-3.5 sm:p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 sm:h-10 sm:w-10">
                <ShieldCheck className="h-4 w-4 text-emerald-700 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 sm:text-base">Secure Verification</h4>
                <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-[15px]">
                  We&apos;ll send a secure one-time link to verify your identity.
                  Your security is our top priority at Greenhouse Market.
                </p>
              </div>
            </div>
          </AuthCard>
        </div>

        <AuthFooter compact />
      </main>
    </AuthShell>
  );
}