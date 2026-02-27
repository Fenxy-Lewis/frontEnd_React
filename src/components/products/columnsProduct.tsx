"use client";

import type { ColumnDef } from "@tanstack/react-table";
// កែសម្រួលការនាំចូល Badge (វាស្ថិតនៅក្នុង folder components/ui មិនមែន react ទេ)
import { Badge } from "../ui/badge";
import { id } from "zod/v4/locales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, SquarePen, Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

// ប្តូរឈ្មោះពី product ទៅ Product (តាមទម្លាប់ TypeScript ប្រើអក្សរធំនៅខាងដើម)
export type Products = {
  id: number;
  name: string;
  price: string | number;
  category: {
    name: string;
  };
  qty: number;
  isActive: boolean;
//   images: string[];
  //   status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
      return (
        <div className="text-green-700 font-medium">
          {formatted}
        </div>
      );
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
  }
  ,
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge className={isActive ? "bg-green-800" : "bg-red-500"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
//   {
//     accessorKey: "images",
//     header: "Images",
//     cell: ({ row }) => {
//       const images = (row.getValue("images") as string[]) ?? [];

//       if (!Array.isArray(images) || images.length === 0) {
//         return <span className="text-muted-foreground">No image</span>;
//       }

//       return (
//         <div className="flex gap-2">
//           {images.slice(0, 3).map((src, index) => (
//             <img
//               key={`${row.id}-img-${index}`}
//               src={src}
//               alt={`Product Image ${index + 1}`}
//               className="w-16 h-16 object-cover rounded"
//               loading="lazy"
//             />
//           ))}
//         </div>
//       );
//     },
//   },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
    //   const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions Menu</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Badge className=" text-green-700 bg-transparent">
                <SquarePen className="h-4 w-4 text-green-700 mr-[5px]" />
                Edit Product
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Badge className=" text-orange-400 bg-transparent">
                <Eye className="h-4 w-4 text-orange-400 mr-[5px]" />
                View Product
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Badge className=" text-red-500 bg-transparent">
              <Trash2 className="h-4 w-4 mr-[5px] text-red-500" />
              Delete Product
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;
