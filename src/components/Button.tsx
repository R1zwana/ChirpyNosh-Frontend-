import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
};

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "px-4 py-2 rounded-md text-sm font-semibold transition inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const v =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : variant === "outline"
      ? "border border-slate-300 bg-white hover:bg-slate-50"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "hover:bg-slate-100";

  return (
    <button type={props.type ?? "button"} className={`${base} ${v} ${className}`} {...props} />
  );
}

