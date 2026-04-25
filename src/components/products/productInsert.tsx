import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/category/useCategories";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema } from "../schemas/productSchema";
import { Switch } from "../ui/switch";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Upload,
  Package,
  DollarSign,
  Hash,
  Layers,
  AlignLeft,
  Tag,
  CheckCircle2,
  XCircle,
  ImageIcon,
  CloudUpload,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useUploadProductImage } from "@/hooks/product/useUploadProductImage";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/* ─── Section heading helper ─────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
      {children}
    </p>
  );
}

/* ─── Icon-prefixed field label helper ───────────────────────── */
function IconLabel({
  icon,
  children,
  required,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {icon}
      {children}
      {required && <span className="text-orange-500 ml-0.5">*</span>}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────
export const ProductInsert = ({ open, setOpen }: Props) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCategories();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: uploadProductImage } = useUploadProductImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {},
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== filename));
    setFileProgresses((prev) => {
      const next = { ...prev };
      delete next[filename];
      return next;
    });
  };

  const form = useForm({
    defaultValues: {
      name: "",
      price: undefined as number | undefined,
      description: "",
      categoryId: 0,
      qty: 0,
      isActive: true,
      productImages: [] as File[],
    },

    validators: {
      onSubmit: ({ value }) => {
        const result = productSchema.safeParse({
          ...value,
          productImages: uploadedFiles.map((file) => ({
            fileName: file.name,
            imageUrl: URL.createObjectURL(file),
          })),
        });
        if (result.success) return undefined;
        return result.error.flatten().fieldErrors;
      },
    },

    onSubmit: async ({ value }) => {
      const newProduct = await createProduct({
        ...value,
        productImages: undefined,
        price: value.price ?? 0,
        categoryId: value.categoryId ?? 0,
      });
      console.log("newProduct Data: ", newProduct);
      if (newProduct.data?.id) {
        await Promise.all(
          uploadedFiles.map((file) =>
            uploadProductImage({
              imageId: newProduct.data.id,
              request: file,
            }),
          ),
        );
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setUploadedFiles([]);
      setFileProgresses({});
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        id="scrollbar-hide"
        className="p-0 sm:max-w-[520px] h-[92vh] overflow-hidden flex flex-col rounded-2xl border-0 shadow-2xl"
      >
        {/* ── Sticky Header ──────────────────────────────────── */}
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-border/60 bg-gradient-to-br from-orange-50/80 to-white dark:from-orange-950/20 dark:to-background">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-md shadow-orange-200 dark:shadow-orange-900/40">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight">
                Add New Product
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill in the details below to create a new product.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Scrollable Form body ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <form
            id="ProductInsertForm"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="px-6 py-5 space-y-6">

              {/* ─ Section 1: Basic Information ──────────────── */}
              <div className="space-y-4">
                <SectionLabel>Basic Information</SectionLabel>

                <div className="grid grid-cols-2 gap-3">
                  {/* Product Name */}
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Product name is required" : undefined,
                    }}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="space-y-1.5">
                          <FieldLabel htmlFor={field.name}>
                            <IconLabel
                              icon={<Package className="w-3 h-3" />}
                              required
                            >
                              Product Name
                            </IconLabel>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            aria-invalid={isInvalid}
                            placeholder="e.g. Macbook Pro"
                            className="h-9 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Product Price */}
                  <form.Field
                    name="price"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Product price is required" : undefined,
                    }}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="space-y-1.5">
                          <FieldLabel htmlFor={field.name}>
                            <IconLabel
                              icon={<DollarSign className="w-3 h-3" />}
                              required
                            >
                              Price
                            </IconLabel>
                          </FieldLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none">
                              $
                            </span>
                            <Input
                              type="number"
                              id={field.name}
                              name={field.name}
                              value={field.state.value ?? ""}
                              onBlur={field.handleBlur}
                              onChange={(e) => {
                                const v = e.target.value;
                                field.handleChange(
                                  (v === ""
                                    ? undefined
                                    : Number(v)) as unknown as number,
                                );
                              }}
                              aria-invalid={isInvalid}
                              placeholder="0.00"
                              className="h-9 pl-7 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
                            />
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category */}
                  <form.Field
                    name="categoryId"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Product category is required" : undefined,
                    }}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="space-y-1.5">
                          <FieldLabel>
                            <IconLabel
                              icon={<Layers className="w-3 h-3" />}
                              required
                            >
                              Category
                            </IconLabel>
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={
                              field.state.value ? String(field.state.value) : ""
                            }
                            onValueChange={(v) =>
                              field.handleChange(Number(v))
                            }
                          >
                            <SelectTrigger className="h-9 text-sm w-full rounded-lg border-border/70 focus:ring-orange-400/40 focus:border-orange-400 transition-colors">
                              <SelectValue
                                placeholder={
                                  isLoading
                                    ? "Loading…"
                                    : "Select category"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectGroup>
                                <SelectLabel className="text-xs text-muted-foreground">
                                  Product Categories
                                </SelectLabel>
                                {data?.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Tag className="w-3 h-3 text-muted-foreground" />
                                      {category.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Quantity */}
                  <form.Field
                    name="qty"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Product quantity is required" : undefined,
                    }}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="space-y-1.5">
                          <FieldLabel htmlFor={field.name}>
                            <IconLabel
                              icon={<Hash className="w-3 h-3" />}
                              required
                            >
                              Quantity
                            </IconLabel>
                          </FieldLabel>
                          <Input
                            type="number"
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              const v = e.target.value;
                              field.handleChange(v === "" ? 0 : Number(v));
                            }}
                            aria-invalid={isInvalid}
                            placeholder="0"
                            className="h-9 text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 transition-colors"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                {/* Description */}
                <form.Field
                  name="description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="space-y-1.5">
                        <FieldLabel htmlFor={field.name}>
                          <IconLabel icon={<AlignLeft className="w-3 h-3" />}>
                            Description
                          </IconLabel>
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter product description…"
                          rows={3}
                          className="text-sm rounded-lg border-border/70 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 resize-none transition-colors"
                          aria-invalid={isInvalid}
                        />
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">
                            {field.state.value.length}/500 characters
                          </span>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-border/40" />

              {/* ─ Section 2: Status ──────────────────────────── */}
              <div className="space-y-3">
                <SectionLabel>Availability</SectionLabel>

                <form.Field
                  name="isActive"
                  children={(field) => (
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        {field.state.value ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium leading-none">
                            Product Status
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {field.state.value
                              ? "Visible and available for sale"
                              : "Hidden from the catalogue"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                            field.state.value
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {field.state.value ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={field.state.value ?? true}
                          onCheckedChange={(v) =>
                            field.handleChange(Boolean(v))
                          }
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-border/40" />

              {/* ─ Section 3: Product Images ──────────────────── */}
              <div className="space-y-3">
                <SectionLabel>Product Images</SectionLabel>

                <form.Field
                  name="productImages"
                  validators={{
                    onChange: ({ value }) =>
                      !value || (Array.isArray(value) && value.length === 0)
                        ? "សូមជ្រើសរើសរូបភាពផលិតផល"
                        : undefined,
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <div className="space-y-3">
                        {/* Drop zone */}
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                            isDragging
                              ? "border-orange-400 bg-orange-50/60 dark:bg-orange-950/20 scale-[1.01]"
                              : isInvalid
                                ? "border-red-400 bg-red-50/50 dark:bg-red-950/10"
                                : "border-border hover:border-orange-400/60 hover:bg-muted/40"
                          }`}
                          onClick={handleBoxClick}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => {
                            handleDrop(e);
                          }}
                        >
                          <div
                            className={`mb-3 rounded-full p-3 transition-colors ${
                              isDragging
                                ? "bg-orange-100 dark:bg-orange-900/40"
                                : isInvalid
                                  ? "bg-red-100 dark:bg-red-900/30"
                                  : "bg-muted"
                            }`}
                          >
                            <CloudUpload
                              className={`h-6 w-6 transition-colors ${
                                isDragging
                                  ? "text-orange-500"
                                  : isInvalid
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {isDragging
                              ? "Drop to upload"
                              : "Drag & drop images here"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            or{" "}
                            <label
                              htmlFor="fileUpload"
                              className="text-orange-500 hover:text-orange-600 font-semibold cursor-pointer underline underline-offset-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              browse files
                            </label>{" "}
                            — PNG, JPG, WEBP up to 4 MB
                          </p>
                          <input
                            type="file"
                            id="fileUpload"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                handleFileSelect(files);
                                field.handleChange([
                                  ...field.state.value,
                                  ...Array.from(files),
                                ]);
                              }
                            }}
                          />
                        </div>

                        {/* Validation error */}
                        {isInvalid && (
                          <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
                            <XCircle className="w-4 h-4 shrink-0" />
                            {field.state.meta.errors.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  }}
                </form.Field>

                {/* ── Uploaded file preview list ───────────────── */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {uploadedFiles.length} file
                      {uploadedFiles.length > 1 ? "s" : ""} selected
                    </div>

                    {uploadedFiles.map((file, index) => {
                      const imageUrl = URL.createObjectURL(file);
                      const progress = fileProgresses[file.name] || 0;
                      const isDone = progress >= 100;

                      return (
                        <div
                          key={file.name + index}
                          className="group relative border border-border/60 rounded-xl p-3 flex items-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors"
                          onLoad={() => () => URL.revokeObjectURL(imageUrl)}
                        >
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/40">
                            <img
                              src={imageUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(file.size / 1024)} KB
                                </span>
                                {isDone && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isDone
                                      ? "bg-emerald-500"
                                      : "bg-orange-400"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-8 text-right">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          </div>

                          {/* Remove button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="w-7 h-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                            onClick={() => {
                              removeFile(file.name);
                              form.setFieldValue(
                                "productImages",
                                form
                                  .getFieldValue("productImages")
                                  .filter((f: File) => f.name !== file.name),
                              );
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty state hint */}
                {uploadedFiles.length === 0 && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground/60">
                    <Upload className="w-3.5 h-3.5" />
                    No images uploaded yet
                  </div>
                )}
              </div>

              {/* bottom padding for scroll */}
              <div className="pb-2" />
            </FieldGroup>
          </form>
        </div>

        {/* ── Sticky Footer ──────────────────────────────────── */}
        <DialogFooter className="shrink-0 px-6 py-4 border-t border-border/60 bg-background/95 backdrop-blur-sm flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="h-9 px-4 text-sm rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="ProductInsertForm"
            className="h-9 px-5 text-sm rounded-lg gap-2 cursor-pointer bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30 disabled:opacity-50 transition-all duration-200"
          >
            {form.state.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                Save Product
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInsert;
