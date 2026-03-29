"use client";
import { useState } from "react";
import { Button } from "../ui/button";
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
      <div className="flex items-center justify-start">
        <Button
          onClick={() => setUpdateOpen(true)}
          className="transition-all duration-300 ease-in-out bg-transparent text-green-700 px-2 rounded-md hover:text-white hover:bg-green-800 flex place-content-center"
        >
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
