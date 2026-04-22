"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { ActionCell } from "./ProductActionCell";

export type Products = {
  id: number;
  productImages: {
    imageUrl: string;
    fileName: string;
    id: number;
    productId: number;
  }[];
  name: string;
  price: string | number;
  description: string;
  category: {
    id: number;
    name: string;
  };
  qty: number;
  isActive: boolean;
};

export const columns: ColumnDef<Products>[] = [
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
    accessorKey: "productImages",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Image
      </span>
    ),
    cell: ({ row }) => {
      const images = row.original.productImages;
      const latestImage =
        images && images.length > 0
          ? [...images].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0]
          : null;
      const imageUrl = latestImage?.imageUrl;

      return (
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-0.5">
          <img
            src={imageUrl ?? "../../../public/img/no-image.png"}
            alt="Product"
            className="h-full w-full object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Product Name
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Price
      </span>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return (
        <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {formatted}
        </span>
      );
    },
  },
  {
    id: "category",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Category
      </span>
    ),
    accessorFn: (row) => row.category?.name ?? "—",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-600 border-0 font-medium text-xs px-2.5 py-0.5 rounded-md"
      >
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "qty",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Stock
      </span>
    ),
    cell: ({ row }) => {
      const qty = row.getValue("qty") as number;
      return (
        <span
          className={`text-sm font-semibold tabular-nums ${
            qty <= 0
              ? "text-red-600"
              : qty <= 5
                ? "text-amber-600"
                : "text-gray-900"
          }`}
        >
          {qty.toLocaleString()}
        </span>
      );
    },
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
      const Icon = isActive ? CircleCheck : CircleX;
      return (
        <Badge
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          <Icon className="h-3 w-3" />
          {isActive ? "Active" : "Inactive"}
        </Badge>
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

export default columns;
