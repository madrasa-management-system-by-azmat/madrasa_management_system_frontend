import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DetailLoadingSkeleton({ className }) {
  return (
    <div
      className={cn("space-y-6", className)}
      aria-label="ریکارڈ لوڈ ہو رہا ہے"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <Skeleton className="size-20 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-48 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5, columns = 4, className }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
      aria-label="فہرست لوڈ ہو رہی ہے"
    >
      <div className="flex items-center justify-between border-b border-border p-5">
        <Skeleton className="h-9 w-56 max-w-[60%]" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="space-y-0 divide-y divide-border px-5">
        {Array.from({ length: rows }, (_, row) => (
          <div
            key={row}
            className="grid gap-4 py-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }, (_, column) => (
              <Skeleton key={column} className="h-5 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardsLoadingSkeleton({ count = 6, className }) {
  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-label="معلومات لوڈ ہو رہی ہیں"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
