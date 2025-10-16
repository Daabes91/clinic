import * as React from "react";
import type { ComponentProps, HTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition",
        variant === "primary" &&
          "border-blue-600 bg-blue-600 text-white hover:bg-blue-500",
        variant === "secondary" &&
          "border-slate-300 bg-white text-slate-900 hover:border-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function Container({
  className,
  ...props
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-2 text-center">
      {eyebrow && (
        <span className="text-xs uppercase tracking-widest text-blue-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mx-auto max-w-2xl text-sm text-slate-600">{description}</p>
      )}
    </header>
  );
}

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("border-b border-slate-100 p-5", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx("text-sm font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx("text-sm text-slate-500", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-5", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("border-t border-slate-100 p-5", className)} {...props} />
  );
}

export function Badge({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "outline";
}) {
  const variantClass = {
    default: "bg-slate-900 text-white border-slate-900",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    outline: "bg-white text-slate-600 border-slate-200"
  }[variant];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClass,
        className
      )}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value,
  trend
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="transition hover:shadow-md">
      <CardContent className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        {trend && <p className="text-xs font-medium text-emerald-600">{trend}</p>}
      </CardContent>
    </Card>
  );
}

export function DataTablePlaceholder({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="space-y-2 text-center text-sm text-slate-500">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
