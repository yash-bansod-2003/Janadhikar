import { type PropsWithChildren } from "react";

export function DashboardHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
} & PropsWithChildren) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}
