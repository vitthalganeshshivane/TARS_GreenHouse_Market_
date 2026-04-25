import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import AuthNavbar from "@/components/auth/AuthNavbar";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthCard from "@/components/auth/AuthCard";
import OTPVerificationModal from "@/components/auth/OTPVerificationModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { sendOtp, verifyOtp } from "../api/otp";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleSendOtp = async () => {
    try {
      await sendOtp(email);
      setShowOTPModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      console.log("Sending:", { email, otp });
      await verifyOtp(email, otp);
      setIsEmailVerified(true);
      setShowOTPModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleSignup = async () => {
    try {
      console.log(name, email, password);
      await signup({
        name,
        email,
        password,
      });

      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthShell>
      <AuthNavbar showLoginLink />

      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1280px] items-center px-4 py-6 sm:px-6 sm:py-8">
        <section className="w-full overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[1.02fr_1fr]">
            {/* LEFT */}
            <div className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-[#dff4ef] via-[#b8e6ca] to-[#4cc487] p-8 lg:block xl:p-10">
              <div className="max-w-[560px]">
                <h1 className="text-5xl leading-[1.03] font-extrabold tracking-tight text-slate-950 xl:text-6xl">
                  Experience the{" "}
                  <span className="text-emerald-700">Peak of</span>
                  <br />
                  <span className="text-emerald-700">Freshness</span> in Every
                  <br />
                  Bite.
                </h1>

                <p className="mt-5 max-w-[540px] text-base leading-8 text-slate-700 xl:text-lg">
                  Join our community of gourmet enthusiasts and get
                  farm-to-table groceries delivered with precision and organic
                  care.
                </p>
              </div>

              <div className="absolute bottom-0 right-0 w-[70%] max-w-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1400&auto=format&fit=crop"
                  alt="Vegetables"
                  className="h-[360px] w-full rounded-tl-[28px] object-cover shadow-2xl [clip-path:polygon(18%_0,100%_14%,100%_100%,0_100%)]"
                />
              </div>

              <div className="absolute bottom-10 left-8 xl:left-10">
                <div className="flex -space-x-3">
                  {[
                    "https://i.pravatar.cc/100?img=21",
                    "https://i.pravatar.cc/100?img=22",
                    "https://i.pravatar.cc/100?img=23",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="user"
                      className="h-11 w-11 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#8af0b2] text-[11px] font-bold text-emerald-950">
                    +12k
                  </div>
                </div>
                <p className="mt-4 text-sm text-emerald-950/85 xl:text-base">
                  Trusted by{" "}
                  <span className="font-bold">12,000+ local foodies</span>
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center bg-white p-5 sm:p-8 md:p-10">
              <AuthCard
                title="Create Account"
                description="Fill in your details to start your journey."
                className="rounded-none border-0 p-0 shadow-none"
                headerClassName="px-0 pt-0 pb-4"
                contentClassName="px-0 pb-0"
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Johnathan Doe"
                      className="h-12 rounded-xl border-slate-200 px-4 text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Email / Phone
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="hello@greenhouse.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl border-slate-200 px-4 pr-11 text-sm sm:text-base"
                      />
                      <Check
                        className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                          isEmailVerified
                            ? "text-emerald-600"
                            : "text-slate-300"
                        }`}
                      />
                    </div>
                    {email && !isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="mt-3 h-10 w-full rounded-xl border border-emerald-700 bg-emerald-50 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-slate-200 px-4 pr-11 text-sm sm:text-base"
                      />
                      <button
                        type={showPassword ? "text" : "password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-[65%] bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
                        Strong
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-slate-200 px-4 text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <Checkbox className="mt-0.5 h-5 w-5 rounded-md border-slate-300" />
                    <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">
                      I agree to{" "}
                      <Link
                        to="/"
                        className="font-medium text-emerald-700 underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and our{" "}
                      <Link
                        to="/"
                        className="font-medium text-emerald-700 underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>

                  <Button
                    className="h-12 w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 text-base font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.26)] hover:opacity-95 sm:h-[52px]"
                    disabled={!isEmailVerified}
                    onClick={handleSignup}
                    style={{
                      opacity: isEmailVerified ? 1 : 0.5,
                      cursor: isEmailVerified ? "pointer" : "not-allowed",
                    }}
                  >
                    Create Account
                  </Button>

                  {/* <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                    Or sign up with
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 sm:h-12 sm:text-base">
                    <span>🔵</span>
                    Google
                  </button>
                  <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 sm:h-12 sm:text-base">
                    <span>🍎</span>
                    Apple
                  </button>
                </div> */}
                </div>
              </AuthCard>
            </div>
          </div>
        </section>
      </main>

      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={(otp) => handleVerifyOtp(otp)}
        email={email}
      />

      <AuthFooter />
    </AuthShell>
  );
}
