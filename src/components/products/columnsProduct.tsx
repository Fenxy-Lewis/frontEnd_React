"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { ActionCell } from "./ProductActionCell";

export type Products = {
  id: number;
  productImages: {
    imageUrl: string;
    fileName:string;
    id:number;
    productId:number;
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
    header: "ID",
  },
  {
    accessorKey: "productImages",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.productImages?.[0]?.imageUrl;
      return (
        <img
          src={imageUrl ?? "../../../public/img/no-image.png"}
          alt="Product Image"
          className="w-10 aspect-square object-cover"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-green-700 font-medium">{formatted}</div>;
    },
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (row) => row.category?.name ?? "—",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      const Icon = isActive ? CircleCheck : CircleX;
      return (
        <Badge
          className={`flex items-center gap-2 ${
            isActive ? "bg-green-700" : "bg-red-600"
          }`}
        >
          <Icon size={16} />
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    // ✅ ប្រើ ActionCell component វិញ ដើម្បីអាច useState បាន
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export default columns;
