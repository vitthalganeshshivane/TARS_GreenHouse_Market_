export default function Loader({
  title = "Loading...",
  subtitle = "Please wait while we fetch the latest data.",
  compact = false,
  plain = false,
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute inline-flex h-10 w-10 rounded-full bg-green-200/70 animate-ping"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-green-600"></span>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-green-200 via-green-500 to-green-200 animate-[pulse_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (plain) {
    return (
      <div className="flex min-h-[260px] w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-green-100 animate-ping opacity-75"></span>
            <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-200/80"></span>
            <span className="relative inline-flex h-6 w-6 rounded-full bg-green-600 shadow-[0_0_24px_rgba(22,163,74,0.35)]"></span>
          </div>

          <h3 className="mt-6 text-base font-bold text-gray-800">{title}</h3>
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>

          <div className="mt-6 w-72 space-y-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-green-100 via-green-500 to-green-100 animate-[pulse_1.6s_ease-in-out_infinite]" />
            </div>
            <div className="h-3 w-4/5 overflow-hidden rounded-full bg-gray-100 mx-auto">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-green-100 via-green-400 to-green-100 animate-[pulse_1.6s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[260px] w-full items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-green-100 animate-ping opacity-75"></span>
            <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-200/80"></span>
            <span className="relative inline-flex h-6 w-6 rounded-full bg-green-600 shadow-[0_0_24px_rgba(22,163,74,0.35)]"></span>
          </div>

          <h3 className="mt-6 text-base font-bold text-gray-800">{title}</h3>
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>

          <div className="mt-6 w-full space-y-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-green-100 via-green-500 to-green-100 animate-[pulse_1.6s_ease-in-out_infinite]" />
            </div>
            <div className="h-3 w-4/5 overflow-hidden rounded-full bg-gray-100 mx-auto">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-green-100 via-green-400 to-green-100 animate-[pulse_1.6s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
