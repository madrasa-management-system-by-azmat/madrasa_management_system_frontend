import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
  return <div data-slot="table-container" className="relative w-full overflow-x-auto"><table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>;
}

function TableHeader({ className, ...props }) {
  return <thead data-slot="table-header" className={cn("border-b border-border [&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableRow({ className, ...props }) {
  return <tr data-slot="table-row" className={cn("border-b border-border transition-colors hover:bg-muted/50", className)} {...props} />;
}

function TableHead({ className, ...props }) {
  return <th data-slot="table-head" className={cn("h-10 px-4 text-right align-middle text-xs font-medium text-muted-foreground", className)} {...props} />;
}

function TableCell({ className, ...props }) {
  return <td data-slot="table-cell" className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

function TableEmpty({ className, colSpan, children }) {
  return <TableRow><TableCell colSpan={colSpan} className="h-36 text-center text-muted-foreground">{children}</TableCell></TableRow>;
}

export { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow };
