import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  iconBg,
  accent,
  badge,
}) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 font-semibold mb-0.5">{title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg || "bg-green-50"}`}
          >
            <Icon className={`w-5 h-5 ${accent || "text-green-600"}`} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-extrabold text-gray-900 leading-tight">
            {value}
          </p>
          {/* {trendValue && (
            <div
              className={`flex items-center gap-1 mt-1 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trendValue}</span>
              <span className="text-gray-400 font-normal">vs last week</span>
            </div>
          )} */}

          {trendValue && (
            <div
              className={`flex items-center gap-1 mt-1 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trendValue}</span>
              <span className="text-gray-400 font-normal">
                {subtitle?.startsWith("This")
                  ? subtitle === "This month"
                    ? "vs last month"
                    : "vs last year"
                  : subtitle === "Today"
                    ? "vs yesterday"
                    : subtitle === "Last 30 days"
                      ? "vs previous 30 days"
                      : "vs previous 7 days"}
              </span>
            </div>
          )}
        </div>
        {badge && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}
          >
            {badge.label}
          </span>
        )}
      </div>
    </div>
  );
}
