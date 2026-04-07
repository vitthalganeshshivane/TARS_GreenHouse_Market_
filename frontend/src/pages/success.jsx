import AuthShell from "@/components/auth/AuthShell";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthNavbar from "@/components/auth/AuthNavbar";
import { Button } from "@/components/ui/button";
import { Check, Leaf, ShoppingBasket, Tag, Truck, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <AuthShell>
      <AuthNavbar
        rightContent={
          <div className="flex items-center gap-4 text-slate-600 sm:gap-5">
            <ShoppingBasket className="h-4 w-4 sm:h-5 sm:w-5" />
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        }
      />

      <main className="px-4 py-8 sm:px-6 md:py-12">
        <div className="mx-auto max-w-[1100px] text-center">
          <div className="relative mx-auto h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="Basket"
              className="h-full w-full rounded-full object-cover shadow-xl"
            />
            <div className="absolute bottom-5 right-1 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 ring-6 ring-[#f7f9fc] sm:bottom-7 sm:right-2 sm:h-14 sm:w-14">
              <Check className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
          </div>

          <h1 className="mt-7 text-4xl leading-[0.95] font-extrabold tracking-tight text-slate-950 sm:mt-8 sm:text-5xl lg:text-6xl">
            Account created
            <br />
            successfully 🎉
          </h1>

          <p className="mx-auto mt-5 max-w-[680px] text-base leading-8 text-slate-600 sm:mt-6 sm:text-lg">
            Welcome to Greenhouse Market. Your gateway to the freshest, most vibrant seasonal produce starts right here.
          </p>

          <Button
            className="mt-8 h-12 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 px-9 text-base font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:opacity-95 sm:mt-10 sm:h-[52px] sm:px-12"
            onClick={() => navigate("/login")}
          >
            Continue Shopping
          </Button>

          <div className="mt-5 sm:mt-6">
            <Link
              to="/"
              className="text-sm text-slate-700 hover:text-emerald-700 sm:text-base"
            >
              Go to Dashboard →
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-[760px] gap-4 sm:mt-14 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
              <Truck className="h-5 w-5 text-emerald-500" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                Free Delivery
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
                On your first 3 orders as a new member.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
              <Tag className="h-5 w-5 text-emerald-500" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                Points Earned
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
                You just earned 50 welcome points.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                Freshness First
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
                Farm-to-table sourcing within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <AuthFooter />
      </main>
    </AuthShell>
  );
}