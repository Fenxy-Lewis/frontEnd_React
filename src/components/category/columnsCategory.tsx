import { type ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CategoryType } from "@/Type/category";
import { ActionCell } from "./ActionCell";

export const columns: ColumnDef<CategoryType>[] = [
  {
    accessorKey: "id",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        ID
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-mono text-gray-400">
        #{row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Category Name
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
          <span className="text-sm font-bold text-violet-600">
            {(row.getValue("name") as string).charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Status
      </span>
    ),
    cell: ({ row }) => {
      const is_active = row.getValue("is_active") as boolean;
      const Icon = is_active ? CircleCheck : CircleX;
      return (
        <Badge
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 ${
            is_active
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          <Icon className="h-3 w-3" />
          {is_active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Created
      </span>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      if (!date) return <span className="text-gray-300">—</span>;
      const d = new Date(date);
      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">
            {d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Updated
      </span>
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      if (!date) return <span className="text-gray-300">—</span>;
      const d = new Date(date);
      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">
            {d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Actions
      </span>
    ),
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
