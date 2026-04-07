import { Link } from "react-router-dom";

export default function AuthNavbar({
  showLoginLink = false,
  rightContent,
}) {
  return (
    <>
      <div className="h-16 md:h-[72px]" />
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:h-[72px] md:px-10">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-emerald-700 sm:text-2xl"
          >
            Greenhouse Market
          </Link>

          {showLoginLink ? (
            <p className="text-sm text-slate-700 sm:text-[15px]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-slate-800 hover:text-emerald-700"
              >
                Log in
              </Link>
            </p>
          ) : (
            rightContent
          )}
        </div>
      </header>
    </>
  );
}