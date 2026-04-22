"use client";
import React, { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import type { ProductExpireType } from "@/Type/productExpire";
import { ProductExpireDelete } from "./productExpireDelete";
import ProductExpireUpdate from "./ProductExpireUpdate";

export function ProductExpireActionCell({
  row,
}: {
  row: { original: ProductExpireType };
}) {
  const item = row.original;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setUpdateOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600"
          title="Edit Expiry"
        >
          <SquarePen className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          title="Delete Expiry"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ProductExpireDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        item={item}
      />
      {updateOpen && (
        <ProductExpireUpdate
          open={updateOpen}
          setOpen={setUpdateOpen}
          item={item}
        />
      )}
    </>
  );
}
