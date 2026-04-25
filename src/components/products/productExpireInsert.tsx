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
  Tag,
  Hash,
} from "lucide-react";

interface ProductExpireInsertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductExpireInsert({
  open,
  setOpen,
}: ProductExpireInsertProps) {
  const [productIdInput, setProductIdInput] = useState("");
  const [debouncedId, setDebouncedId] = useState<number | null>(null);
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const { mutateAsync: createExpiry, isPending } = useCreateProductExpire();

  // Debounce: wait 500ms after user stops typing before fetching
  useEffect(() => {
    const parsed = parseInt(productIdInput, 10);
    const isValid =
      productIdInput.trim() !== "" && !isNaN(parsed) && parsed > 0;
    const timer = setTimeout(
      () => setDebouncedId(isValid ? parsed : null),
      500,
    );
    return () => clearTimeout(timer);
  }, [productIdInput]);

  // Reset all form fields when the dialog is opened (event handler – no effect)
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setProductIdInput("");
      setDebouncedId(null);
      setBatchNumber("");
      setExpiryDate("");
    }
    setOpen(isOpen);
  };

  // Fetch product by ID (only runs when debouncedId is a valid number)
  const {
    data: foundProduct,
    isLoading,
    isFetching,
    isError: notFound,
  } = useProductById(debouncedId);

  const isLookingUp = isLoading || isFetching;

  // Resolve product image (latest image by id)
  const productImage =
    foundProduct?.productImages
      ?.slice()
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0]?.imageUrl ?? null;

  const handleCreate = async () => {
    if (!debouncedId || !foundProduct || !batchNumber || !expiryDate) return;
    try {
      await createExpiry({ productId: debouncedId, batchNumber, expiryDate });
      setOpen(false);
    } catch {
      // error toast is handled inside the hook
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
      <DialogContent className="sm:max-w-[430px]">
        {/* ── Header ── */}
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
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Product ID <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="number"
                min={1}
                value={productIdInput}
                onChange={(e) => setProductIdInput(e.target.value)}
                placeholder="Enter Product ID..."
                className="pl-10 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* ── Lookup State ── */}
            {debouncedId && (
              <div className="mt-1">
                {/* Loading */}
                {isLookingUp && (
                  <div className="flex items-center gap-2 px-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                    <span className="text-xs text-gray-400">
                      Looking up product...
                    </span>
                  </div>
                )}

                {/* Not Found */}
                {!isLookingUp && notFound && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span className="text-xs font-medium text-red-500">
                      Product not found — check the ID and try again.
                    </span>
                  </div>
                )}

                {/* ── Product Card (shown when found) ── */}
                {!isLookingUp && !notFound && foundProduct?.name && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-1 shadow-sm">
                    {/* Image */}
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-sm">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={foundProduct.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-50">
                          <Package className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Name */}
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-2 w-2 shrink-0 text-emerald-500" />
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {foundProduct.name}
                        </p>
                      </div>

                      {/* ID + Category */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                          <Hash className="h-1 w-1" />
                          {foundProduct.id}
                        </span>
                        {foundProduct.category?.name && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <Tag className="h-1 w-1" />
                            {foundProduct.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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

        {/* ── Footer ── */}
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
