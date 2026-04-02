import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-2 flex items-center gap-2 md:mt-0">{actions}</div>
      )}
    </div>
  );
}
