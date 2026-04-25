import React, { useState, useRef, useEffect } from "react";
import { useCreateProductExpire } from "@/hooks/product/useProductsExpire";
import { useProducts } from "@/hooks/product/useProducts";
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
  Search,
  CheckCircle2,
  Loader2,
  Package,
} from "lucide-react";
import type { ProductType } from "@/Type/product";

interface ProductExpireInsertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductExpireInsert({
  open,
  setOpen,
}: ProductExpireInsertProps) {
  // Search state
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const { mutateAsync: createExpiry, isPending } = useCreateProductExpire();

  // Debounce search text → 400ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSearchText("");
      setDebouncedSearch("");
      setSelectedProduct(null);
      setBatchNumber("");
      setExpiryDate("");
      setShowDropdown(false);
    }
  }, [open]);

  // Click outside → close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch products using existing /products?search= endpoint
  const {
    data,
    isFetching: isSearching,
  } = useProducts(debouncedSearch, 1, 10);

  const productList: ProductType[] = Array.isArray(data)
    ? data
    : data?.data ?? [];

  const handleSelectProduct = (product: ProductType) => {
    setSelectedProduct(product);
    setSearchText(product.name);
    setShowDropdown(false);
  };

  const handleCreate = async () => {
    if (!selectedProduct?.id || !batchNumber || !expiryDate) return;
    try {
      await createExpiry({
        productId: selectedProduct.id,
        batchNumber,
        expiryDate,
      });
      setOpen(false);
    } catch {
      // toast handled by hook
    }
  };

  const isFormValid = !!selectedProduct && !!batchNumber && !!expiryDate;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[440px]">
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

          {/* ── Product Search ── */}
          <div className="space-y-1.5" ref={dropdownRef}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Product <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              {/* Search icon or spinner */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                ) : (
                  <Search className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <Input
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setSelectedProduct(null); // clear selection when typing
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (searchText.trim()) setShowDropdown(true);
                }}
                placeholder="Search product by name..."
                className="pl-10 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              />

              {/* Dropdown Results */}
              {showDropdown && debouncedSearch.trim() && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  {isSearching ? (
                    <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Searching...
                    </div>
                  ) : productList.length === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-400">
                      <Package className="h-3.5 w-3.5" />
                      No products found
                    </div>
                  ) : (
                    <ul className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                      {productList.map((p) => {
                        const img = p.productImages?.sort(
                          (a, b) => (b.id ?? 0) - (a.id ?? 0)
                        )[0]?.imageUrl;
                        return (
                          <li
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-emerald-50 transition-colors"
                          >
                            {/* Product Thumbnail */}
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                              <img
                                src={img ?? "/img/no-image.png"}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                ID #{p.id} · {p.category?.name ?? "—"}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Selected Product Confirmation */}
            {selectedProduct && (
              <div className="flex items-center gap-2 mt-1.5 px-1">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 truncate">
                  {selectedProduct.name}
                  <span className="text-emerald-400 font-normal ml-1">
                    (ID #{selectedProduct.id})
                  </span>
                </span>
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
