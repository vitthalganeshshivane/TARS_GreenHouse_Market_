import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ current, total, onPageChange }) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, 4, 5, "...", total);
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600 rounded-xl border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`w-9 h-9 text-sm font-semibold rounded-xl transition-all ${
              page === current
                ? "bg-green-600 text-white shadow-sm"
                : page === "..."
                  ? "cursor-default text-gray-400"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600 rounded-xl border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
