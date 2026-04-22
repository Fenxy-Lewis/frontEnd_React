"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX, Mail, Phone, Calendar } from "lucide-react";
import { CustomerActionCell } from "./CustomerActionCell";
import type { CustomerType } from "@/Type/customer";

export const columnsCustomer: ColumnDef<CustomerType>[] = [
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
    accessorKey: "firstname",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        First Name
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900">
        {row.getValue("firstname")}
      </span>
    ),
  },
  {
    accessorKey: "lastname",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Last Name
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900">
        {row.getValue("lastname")}
      </span>
    ),
  },
  {
    accessorKey: "username",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Username
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.getValue("username")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Email
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Mail className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-sm text-gray-600">
          {row.getValue("email") || "—"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Phone
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Phone className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-sm text-gray-600">
          {row.getValue("phone") || "—"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Status
      </span>
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {isActive ? (
            <CircleCheck className="h-3 w-3" />
          ) : (
            <CircleX className="h-3 w-3" />
          )}
          {isActive ? "Active" : "Hidden"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Joined
      </span>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      if (!date) return <span className="text-gray-300">—</span>;
      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="h-3 w-3" />
          <span className="text-xs">
            {new Date(date).toLocaleDateString("en-US", {
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
    cell: ({ row }) => <CustomerActionCell row={row} />,
  },
];

export default columnsCustomer;
