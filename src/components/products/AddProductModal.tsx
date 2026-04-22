import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Plus } from "lucide-react";
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
  price: string; // keep as string for input
  qty: string; // keep as string for input
  categoryId: string; // select returns string
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

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errorMsg, setErrorMsg] = useState("");

  const queryClient = useQueryClient();

  // Load categories for dropdown
  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Basic validation
  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.price.trim().length > 0 &&
      form.qty.trim().length > 0 &&
      form.categoryId.trim().length > 0
    );
  }, [form]); //   return value: true and false only, so we can use it to disable submit button and show error message

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
      setErrorMsg("Please fill: Name, Price, Qty, Category");
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
      setErrorMsg("Price/Qty/Category must be number");
      return;
    }

    mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-400">
          <Plus className="w-4 h-4" color="white" />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Insert Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Macbook Pro M5"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short description..."
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <Input
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="e.g. Black"
            />
          </div>

          {/* Price + Qty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Price *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => setForm({ ...form, categoryId: v })}
              disabled={catLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={catLoading ? "Loading..." : "Select category"}
                />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">Status</div>
              <div className="text-sm text-muted-foreground">
                {form.isActive ? "Active" : "Inactive"}
              </div>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm({ ...form, isActive: checked })
              }
            />
          </div>

          {/* Error */}
          {errorMsg ? (
            <div className="text-sm text-red-500">{errorMsg}</div>
          ) : null}

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
