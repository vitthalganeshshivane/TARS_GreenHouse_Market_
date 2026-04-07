export default function AuthShell({ children, className = "" }) {
  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-[#f7f9fc] ${className}`}
    >
      {/* soft blurred background blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-[28rem] w-[28rem] rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}