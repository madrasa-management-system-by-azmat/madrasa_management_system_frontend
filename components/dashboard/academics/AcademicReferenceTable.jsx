import { Layers3 } from "lucide-react";

import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const loadingLabel = "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0644\u0648\u0688 \u06C1\u0648 \u0631\u06C1\u06CC \u06C1\u06CC\u06BA...";
const emptyLabel = "\u0627\u0628\u06BE\u06CC \u06A9\u0648\u0626\u06CC \u0631\u06CC\u06A9\u0627\u0631\u0688 \u0634\u0627\u0645\u0644 \u0646\u06C1\u06CC\u06BA \u06C1\u06D2\u06D4";

export default function AcademicReferenceTable({ columns, items = [], isLoading }) {
  return (
    <Table>
      <TableHeader><TableRow>{columns.map((column) => <TableHead key={column.key}>{column.label}</TableHead>)}</TableRow></TableHeader>
      <TableBody>
        {isLoading ? <TableEmpty colSpan={columns.length}>{loadingLabel}</TableEmpty> : items.length === 0 ? <TableEmpty colSpan={columns.length}><span className="inline-flex items-center gap-2"><Layers3 className="size-4" aria-hidden="true" />{emptyLabel}</span></TableEmpty> : items.map((item) => <TableRow key={item.id}>{columns.map((column) => <TableCell key={column.key}>{column.render(item)}</TableCell>)}</TableRow>)}
      </TableBody>
    </Table>
  );
}
