import React, { useState } from "react";
import { useUpdateProductExpire } from "@/hooks/product/useProductsExpire";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, SquarePen, Save } from "lucide-react";
import type { ProductExpireType } from "@/Type/productExpire";

interface ProductExpireUpdateProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: ProductExpireType;
}

export default function ProductExpireUpdate({
  open,
  setOpen,
  item,
}: ProductExpireUpdateProps) {
  const [batchNumber, setBatchNumber] = useState(item.batchNumber || "");
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date(item.expiryDate);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  });

  const { mutateAsync: updateExpiry, isPending } = useUpdateProductExpire();

  const handleUpdate = async () => {
    if (!batchNumber || !expiryDate || !item.id) return;
    try {
      await updateExpiry({
        id: item.id,
        payload: { batchNumber, expiryDate },
      });
      setOpen(false);
    } catch {
      // toast is already in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <SquarePen className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Update Expiry</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Modify expiry details for {item.product?.name ?? "this product"}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Batch Number <span className="text-red-400">*</span>
            </label>
            <Input
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. BATCH-001"
              className="rounded-xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Expiry Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isPending || !batchNumber || !expiryDate}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20"
          >
            {isPending ? (
               <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
               <Save className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Updating..." : "Update Details"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
