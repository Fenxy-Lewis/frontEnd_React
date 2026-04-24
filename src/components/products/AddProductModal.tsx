import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Plus,
  Package,
  Tag,
  DollarSign,
  Hash,
  AlignLeft,
  Palette,
  Layers,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CreateProductInput } from "@/Type/product";
import { fetchCategory } from "@/services/category.service";
import { CreateProduct } from "@/services/product.service";

type FormState = {
  name: string;
  description: string;
  color: string;
  price: string;
  qty: string;
  categoryId: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  description: "",
  color: "",
  price: "",
  qty: "",
  categoryId: "",
  isActive: true,
};

/* ── tiny helper: icon-wrapped input ──────────────────────────── */
function FieldRow({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
        {required && <span className="text-orange-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errorMsg, setErrorMsg] = useState("");

  const queryClient = useQueryClient();

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategory,
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.price.trim().length > 0 &&
      form.qty.trim().length > 0 &&
      form.categoryId.trim().length > 0
    );
  }, [form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateProductInput) => CreateProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setForm(initialForm);
      setErrorMsg("");
      setOpen(false);
    },
    onError: (e: Error) => {
      setErrorMsg(e?.message || "Create product failed");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!canSubmit) {
      setErrorMsg("Please fill in: Name, Price, Qty and Category.");
      return;
    }

    const payload: CreateProductInput = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      color: form.color.trim() || undefined,
      price: Number(form.price),
      qty: Number(form.qty),
      categoryId: Number(form.categoryId),
      isActive: form.isActive,
    };

    if (
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.qty) ||
      Number.isNaN(payload.categoryId)
    ) {
      setErrorMsg("Price, Qty and Category must be valid numbers.");
      return;
    }

    mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md shadow-orange-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* ── Header ──────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-gradient-to-br from-orange-50/80 to-white dark:from-orange-950/20 dark:to-background">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-md shadow-orange-200 dark:shadow-orange-900/40">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight">
                New Product
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill in the details to add a new product.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form body ────────────────────────────────────────── */}
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">

          {/* Section: Basic Info */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Basic Information
            </p>

            {/* Product Name */}
            <FieldRow
              label="Product Name"
              required
              icon={<Package className="w-3 h-3" />}
            >
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Macbook Pro M5"
                className="h-9 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
              />
            </FieldRow>

            {/* Description */}
            <FieldRow
              label="Description"
              icon={<AlignLeft className="w-3 h-3" />}
            >
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short product description..."
                rows={3}
                className="text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 resize-none transition-colors"
              />
            </FieldRow>

            {/* Color */}
            <FieldRow label="Color" icon={<Palette className="w-3 h-3" />}>
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="e.g. Midnight Black"
                className="h-9 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
              />
            </FieldRow>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Section: Pricing & Stock */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Pricing &amp; Stock
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <FieldRow
                label="Price"
                required
                icon={<DollarSign className="w-3 h-3" />}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="h-9 pl-7 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
                  />
                </div>
              </FieldRow>

              {/* Quantity */}
              <FieldRow
                label="Quantity"
                required
                icon={<Hash className="w-3 h-3" />}
              >
                <Input
                  type="number"
                  min={0}
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  placeholder="0"
                  className="h-9 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
                />
              </FieldRow>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Section: Classification */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Classification
            </p>

            {/* Category */}
            <FieldRow
              label="Category"
              required
              icon={<Layers className="w-3 h-3" />}
            >
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
                disabled={catLoading}
              >
                <SelectTrigger className="h-9 text-sm rounded-lg border-border/70 focus:ring-orange-400/40 focus:border-orange-400 transition-colors">
                  <SelectValue
                    placeholder={
                      catLoading ? "Loading categories…" : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>

            {/* Status toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                {form.isActive ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium leading-none">
                    Product Status
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.isActive
                      ? "Visible and available for sale"
                      : "Hidden from the catalogue"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    form.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isActive: checked })
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* ── Footer actions ─────────────────────────────────── */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="h-9 px-4 text-sm rounded-lg"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!canSubmit || isPending}
              className="h-9 px-5 text-sm rounded-lg gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
