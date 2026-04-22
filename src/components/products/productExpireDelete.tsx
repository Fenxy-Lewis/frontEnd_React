import React from "react";
import { useDeleteProductExpire } from "@/hooks/product/useProductsExpire";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { ProductExpireType } from "@/Type/productExpire";

interface ProductExpireDeleteProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: ProductExpireType;
}

export const ProductExpireDelete: React.FC<ProductExpireDeleteProps> = ({
  open,
  setOpen,
  item,
}) => {
  const { mutateAsync: deleteExpiry, isPending } = useDeleteProductExpire();

  const handleDelete = async () => {
    // API Call goes here: await deleteProductExpire(item.id)
    if (!item.id) return;
    try {
      await deleteExpiry(item.id);
      setOpen(false);
    } catch {
      // toast is already mapped in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4 mx-auto">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Delete Expiry Record?
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete the expiry record for{" "}
            <strong>{item.product?.name ?? "this product"}</strong> (Batch:{" "}
            {item.batchNumber})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2 mt-4 flex w-full">
          <Button
            className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
