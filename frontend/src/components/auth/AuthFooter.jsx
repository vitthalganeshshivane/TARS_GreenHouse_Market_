import { Link } from "react-router-dom";

export default function AuthFooter({ compact = false }) {
  return (
    <footer className={`text-center ${compact ? "pt-8 pb-6" : "py-10 sm:py-12"}`}>
      <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
        Greenhouse Market
      </h3>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 sm:mt-5 sm:gap-7 sm:text-base">
        <Link to="/" className="hover:text-emerald-700">
          Privacy Policy
        </Link>
        <Link to="/" className="hover:text-emerald-700">
          Terms of Service
        </Link>
        <Link to="/" className="hover:text-emerald-700">
          Help Center
        </Link>
      </div>

      <p className="mt-6 text-sm text-slate-500 sm:text-base">
        © 2024 Greenhouse Market. Freshness Guaranteed.
      </p>
    </footer>
  );
}