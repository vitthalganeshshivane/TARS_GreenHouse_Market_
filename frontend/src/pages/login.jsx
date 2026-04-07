import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import AuthNavbar from "@/components/auth/AuthNavbar";
import AuthCard from "@/components/auth/AuthCard";
import AuthFooter from "@/components/auth/AuthFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell>
      <AuthNavbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-[1180px] overflow-hidden rounded-3xl bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[1.02fr_1fr]">
            {/* LEFT */}
            <div className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-[#dff7ef] via-[#bde8d2] to-[#43bf84] p-8 lg:block xl:p-10">
              <div className="flex items-center gap-3 text-emerald-800">
                <Leaf className="h-7 w-7 fill-emerald-700 text-emerald-700" />
                <span className="text-xl font-bold">Greenhouse Market</span>
              </div>

              <div className="mt-9 max-w-[500px]">
                <h1 className="text-5xl leading-[0.95] font-extrabold tracking-tight text-emerald-950 xl:text-6xl">
                  Freshness,
                  <br />
                  Delivered to
                  <br />
                  Your Doorstep.
                </h1>

                <p className="mt-4 text-base leading-8 text-slate-700 xl:text-lg">
                  Sustainably sourced groceries from local greenhouses to your kitchen.
                </p>
              </div>

              <div className="absolute bottom-0 right-0 w-[60%] max-w-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
                  alt="Fresh vegetables"
                  className="h-[300px] w-full rounded-tl-[28px] object-cover shadow-2xl [clip-path:polygon(18%_0,100%_14%,100%_100%,0_100%)]"
                  //h-320 (previous)
                />
              </div>

              <div className="absolute bottom-10 left-8 xl:left-10">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[
                      "https://i.pravatar.cc/100?img=12",
                      "https://i.pravatar.cc/100?img=15",
                      "https://i.pravatar.cc/100?img=18",
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="user"
                        className="h-11 w-11 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#8af0b2] text-[11px] font-bold text-emerald-950">
                      +10k
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-emerald-950/85 xl:text-base">
                  Join 10,000+ happy healthy eaters
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center bg-white p-5 sm:p-8 md:p-10">
              <AuthCard
                title="Welcome Back"
                description="Log in to manage your fresh cart."
                className="shadow-none border-0 rounded-none p-0"
                headerClassName="px-0 pt-0 pb-4"
                contentClassName="px-0 pb-0"
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Email / Phone
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="hello@example.com"
                        className="h-12 rounded-xl border-slate-200 pl-10 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-semibold text-emerald-700 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-slate-200 pl-10 pr-10 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button className="h-12 w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 text-base font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:opacity-95 sm:h-[52px]">
                    Login
                  </Button>

                  {/* <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                      Or continue with
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:text-base">
                    <span className="text-base sm:text-lg">G</span>
                    Sign in with Google
                  </button>
                  */}

                  <p className="pt-2 text-center text-sm text-slate-700 sm:text-base">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-semibold text-emerald-700 hover:underline">
                      Sign Up
                    </Link>
                  </p> 
                </div>
              </AuthCard>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-400 sm:text-base">
          © 2024 Greenhouse Market. Freshness Guaranteed.
        </p>
      </div>
    </AuthShell>
  );
}