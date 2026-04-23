import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function BackHeader({ title, fallback = "/" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    // sticky top-0 z-50
    <div className="flex items-center gap-3 p-3 border-b border-gray-150 bg-white sticky top-0 z-50">
      <button
        onClick={handleBack}
        className="py-2 px-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        <ArrowLeft size={22} strokeWidth={2} />
      </button>

      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
