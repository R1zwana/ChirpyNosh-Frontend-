type BadgeTone = "default" | "green" | "amber" | "slate";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export default function Badge({
  children,
  tone = "default",
  className = "",
}: BadgeProps) {
  const base =
    "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full";

  const tones: Record<BadgeTone, string> = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    slate: "bg-slate-200 text-slate-800",
  };

  return (
    <span className={`${base} ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
