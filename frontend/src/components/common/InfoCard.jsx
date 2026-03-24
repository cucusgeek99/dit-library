import { Badge } from "@/components/ui/badge";

export default function InfoCard({
  title,
  value,
  description,
  icon: Icon,
  badgeText,
  badgeVariant = "default",
}) {
  const badgeStyles = {
    default: "bg-[#154854] text-white hover:bg-[#154854]",
    success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    warning: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    danger: "bg-red-100 text-red-700 hover:bg-red-100",
    neutral: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/40 bg-white p-5 shadow-sm shadow-slate-200/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/30">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#154854]/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#154854] text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

        {badgeText ? (
          <Badge
            className={`rounded-full px-3 py-1 text-xs ${badgeStyles[badgeVariant]}`}
          >
            {badgeText}
          </Badge>
        ) : null}
      </div>

      <div className="relative mt-5 space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
          {value}
        </h3>
        {description ? (
          <p className="text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
