"use client";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { CategoryDelete } from "./categoryDelete";
import type { CategoryType } from "@/Type/category";

export function ActionCell({ row }: { row: { original: CategoryType } }) {
  const category = row.original;
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600"
          title="Edit"
        >
          <SquarePen className="h-4 w-4" />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <CategoryDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        categoryId={category.id}
        categoryName={category.name}
      />
    </>
  );
}
