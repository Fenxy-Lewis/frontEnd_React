"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import type { ProductExpireType } from "@/Type/productExpire";
import { ProductExpireActionCell } from "./ProductExpireActionCell";

export const columnsProductExpire: ColumnDef<ProductExpireType>[] = [
  {
    accessorKey: "id",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        ID
      </span>
    ),
    cell: ({ row }) => {
      const id = row.original.id || row.original.productId;
      return (
        <span className="text-sm font-mono text-gray-400">
          #{id}
        </span>
      );
    },
  },
  {
    id: "productImage",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Image
      </span>
    ),
    cell: ({ row }) => {
      const images = row.original.product?.productImages;
      const latestImage =
        images && images.length > 0
          ? [...images].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0]
          : null;
      const imageUrl = latestImage?.imageUrl || (row.original.product as any)?.imageUrl || (row.original as any)?.imageUrl;

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
    id: "productName",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Product Name
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900">
        {row.original.product?.name ?? "Unknown Product"}
      </span>
    ),
  },
  {
    accessorKey: "batchNumber",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Batch No.
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 font-medium">
        {row.getValue("batchNumber") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Expiry Date
      </span>
    ),
    cell: ({ row }) => {
      const expiry = new Date(row.getValue("expiryDate") as string | Date);
      if (isNaN(expiry.getTime())) return <span className="text-gray-400">—</span>;
      
      const formatted = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(expiry);
      
      return (
        <span className="text-sm font-medium text-gray-700">
          {formatted}
        </span>
      );
    },
  },
  {
    id: "daysRemaining",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Remaining
      </span>
    ),
    cell: ({ row }) => {
      const expiryStr = row.getValue("expiryDate") as string | Date;
      if (!expiryStr) return "—";
      const expiry = new Date(expiryStr);
      const today = new Date();
      // Set to start of day for accurate day calculation
      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return (
          <span className="text-sm font-bold text-red-600">
            Expired {Math.abs(diffDays)} days ago
          </span>
        );
      } else if (diffDays === 0) {
        return (
          <span className="text-sm font-bold text-red-600">
            Expires today
          </span>
        );
      } else if (diffDays <= 30) {
        return (
          <span className="text-sm font-bold text-amber-600">
            {diffDays} days
          </span>
        );
      }
      return (
        <span className="text-sm font-medium text-emerald-600">
          {diffDays} days
        </span>
      );
    },
  },
  {
    id: "status",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Status
      </span>
    ),
    cell: ({ row }) => {
      const expiryStr = row.getValue("expiryDate") as string | Date;
      if (!expiryStr) return "—";
      const expiry = new Date(expiryStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        return (
          <Badge
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 bg-red-50 text-red-600"
          >
            <AlertCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      } else if (diffDays <= 30) {
        return (
          <Badge
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 bg-amber-50 text-amber-600"
          >
            <AlertTriangle className="h-3 w-3" />
            Expiring Soon
          </Badge>
        );
      }
      return (
        <Badge
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 bg-emerald-50 text-emerald-700"
        >
          <CheckCircle2 className="h-3 w-3" />
          Safe
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Actions
      </span>
    ),
    cell: ({ row }) => <ProductExpireActionCell row={row} />,
  },
];
