"use client"
import { type ColumnDef } from "@tanstack/react-table"
export type Category = {
  id: string
  name: string
  is_active: boolean
  products: {
    name: string
    price: number
    qty: number
    isActive: boolean
  }[]
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
      const is_active = row.getValue("is_active");
      return (
        <div className={is_active ? "text-white bg-green-700 p-1 text-center w-[80px] rounded-2xl font-bold" : "text-red-500"}>
          {is_active ? "Active" : "Inactive"}
        </div>
      );
    },
  },
]