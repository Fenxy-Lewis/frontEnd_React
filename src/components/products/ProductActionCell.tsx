"use client";
import { useState } from "react";
import { SquarePen, Eye, Trash2 } from "lucide-react";
import { ProductDelete } from "./productDelete";
import ProductUpdate from "./ProductUpdate";
import type { Products } from "./columnsProduct";

export function ActionCell({ row }: { row: { original: Products } }) {
  const product = row.original;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [UpdateOpen, setUpdateOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setUpdateOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600"
          title="Edit"
        >
          <SquarePen className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
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

      <ProductDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        productId={product.id}
        productName={product.name}
      />
      {UpdateOpen && product && (
        <ProductUpdate
          open={UpdateOpen}
          setOpen={setUpdateOpen}
          product={product}
        />
      )}
    </>
  );
}
