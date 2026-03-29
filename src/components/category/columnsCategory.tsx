"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { CircleCheck, CircleX, Eye, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CategoryDelete } from "./categoryDelete";
export type Category = {
  id: string;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  products: {
    name: string;
    price: number;
    qty: number;
    isActive: boolean;
  }[];
};

function ActionCell({ row }: { row: { original: Category } }) {
  const Category = row.original;
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-start">
        <Button className="transition-all duration-300 ease-in-out bg-transparent text-green-700 px-2 rounded-md hover:text-white hover:bg-green-800 flex place-content-center">
          <SquarePen size={16} />
        </Button>
        <Button className="transition-all duration-300 ease-in-out bg-transparent text-blue-700 px-2 rounded-md hover:text-white hover:bg-blue-800 flex place-content-center mx-2">
          <Eye size={16} />
        </Button>
        <Button
          className="transition-all duration-300 ease-in-out bg-transparent text-red-500 px-2 rounded-md hover:text-white hover:bg-red-600 flex place-content-center"
          onClick={() => setDeleteOpen(true)} // ✅ បើក Dialog
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* ✅ AlertDialog សម្រាប់ confirm delete */}
      <CategoryDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        categoryId={Category.id}
        categoryName={Category.name}
      />
    </>
  );
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const is_active = row.getValue("is_active") as boolean;
      const Icon = is_active ? CircleCheck : CircleX;
      return (
        <Badge
          className={`flex items-center gap-2 ${
            is_active ? "bg-green-700" : "bg-red-600"
          }`}
        >
          <Icon size={16} />
          {is_active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      console.log(row.original); // ← មើល field names នៅទីនេះ
      const date = row.getValue("createdAt") as string;
      return <span>{date ? new Date(date).toLocaleDateString() : "—"}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      console.log(row.original); // ← មើល field names នៅទីនេះ
      const date = row.getValue("updatedAt") as string;
      return <span>{date ? new Date(date).toLocaleDateString() : "—"}</span>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    // ✅ ប្រើ ActionCell component វិញ ដើម្បីអាច useState បាន
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
