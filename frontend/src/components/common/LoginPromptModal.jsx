import { useNavigate } from "react-router";
import { X, Lock } from "lucide-react";

export default function LoginPromptModal({ isOpen, onClose, message }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <Lock size={24} className="text-green-600" />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Login required
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {message || "Please login or create an account to continue."}
          </p>

          <div className="flex flex-col gap-2 w-full mt-6">
            <button
              onClick={handleLogin}
              className="w-full py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="w-full py-2.5 rounded-xl border border-green-600 text-green-600 font-semibold text-sm hover:bg-green-50 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
