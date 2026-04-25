import React, { useState, useEffect } from "react";
import { useCreateProductExpire } from "@/hooks/product/useProductsExpire";
import { useProductById } from "@/hooks/product/useProducts";
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
import {
  Timer,
  Plus,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ProductExpireInsertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductExpireInsert({
  open,
  setOpen,
}: ProductExpireInsertProps) {
  // ID input state
  const [productIdInput, setProductIdInput] = useState("");
  const [debouncedId, setDebouncedId] = useState<number | null>(null);

  // Form state
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const { mutateAsync: createExpiry, isPending } = useCreateProductExpire();

  // ── Debounce product ID input → 500ms ──
  useEffect(() => {
    const parsed = parseInt(productIdInput, 10);
    const isValid = productIdInput.trim() !== "" && !isNaN(parsed) && parsed > 0;
    const timer = setTimeout(() => setDebouncedId(isValid ? parsed : null), 500);
    return () => clearTimeout(timer);
  }, [productIdInput]);

  // ── Reset form when dialog opens (event handler, not effect) ──
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setProductIdInput("");
      setDebouncedId(null);
      setBatchNumber("");
      setExpiryDate("");
    }
    setOpen(isOpen);
  };

  // ── Fetch product by ID ──
  const {
    data: foundProduct,
    isLoading: isSearching,
    isFetching: isRefetching,
    isError: notFound,
  } = useProductById(debouncedId);

  const isLookingUp = isSearching || isRefetching;

  const handleCreate = async () => {
    if (!debouncedId || !foundProduct || !batchNumber || !expiryDate) return;
    try {
      await createExpiry({
        productId: debouncedId,
        batchNumber,
        expiryDate,
      });
      setOpen(false);
    } catch {
      // toast handled by hook
    }
  };

  const isFormValid =
    !!debouncedId &&
    !!foundProduct &&
    !notFound &&
    !!batchNumber &&
    !!expiryDate;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Set Expiry to Product
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Create a new expiry tracking record for a product.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          {/* ── Product ID Input ── */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Product ID <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="number"
                min={1}
                value={productIdInput}
                onChange={(e) => setProductIdInput(e.target.value)}
                placeholder="Enter Product ID..."
                className="pl-10 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* ── Product Lookup Result ── */}
            {debouncedId && (
              <div className="flex items-center gap-2 mt-1.5 px-1 min-h-[20px]">
                {isLookingUp ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                    <span className="text-xs text-gray-400">Looking up product...</span>
                  </>
                ) : notFound ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-xs text-red-400">Product not found</span>
                  </>
                ) : foundProduct?.name ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">
                      {foundProduct.name}
                    </span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* ── Batch Number ── */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Batch Number <span className="text-red-400">*</span>
            </label>
            <Input
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. BATCH-001"
              className="rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* ── Expiry Date ── */}
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
                className="pl-10 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
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
            onClick={handleCreate}
            disabled={isPending || !isFormValid}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20"
          >
            {isPending ? (
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Saving..." : "Save Expiry Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
