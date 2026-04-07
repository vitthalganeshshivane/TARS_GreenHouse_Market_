import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthCard({
  title,
  description,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}) {
  return (
    <Card className={`w-full rounded-3xl border-0 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] ${className}`}>
      {(title || description) && (
        <CardHeader className={`px-5 pt-6 pb-3 sm:px-8 sm:pt-8 ${headerClassName}`}>
          {title && (
            <h2 className="text-2xl leading-tight font-bold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
              {description}
            </p>
          )}
        </CardHeader>
      )}

      <CardContent className={`px-5 pb-6 sm:px-8 sm:pb-8 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
}