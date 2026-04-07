// components/auth/AuthLayout.jsx
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      
      {/* LEFT */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 bg-gradient-to-br from-green-100 to-green-300">
        <h1 className="text-5xl font-bold leading-tight text-green-900">
          {title}
        </h1>
        <p className="mt-4 text-lg text-green-800 max-w-md">
          {subtitle}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
        {children}
      </div>
    </div>
  );
}