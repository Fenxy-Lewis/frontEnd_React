import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/category/useCategories";
import {
  Field,
  FieldDescription,
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
  DialogDescription,
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
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import type { Products } from "@/components/products/columnsProduct";
import { Trash2, Upload } from "lucide-react";
import { useUploadProductImage } from "@/hooks/product/useUploadProductImage";
import { useRef, useState } from "react";
import { useDeleteProductImage } from "@/hooks/product/useDeleteImage";
import type { ProductImage } from "@/Type/product";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: Products;
}

export const ProductUpdate = ({ open, setOpen, product }: Props) => {
  const { data, isLoading } = useCategories();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProductImageMutate } = useDeleteProductImage();
  const { mutateAsync: uploadProductImage } = useUploadProductImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
  };

  const form = useForm({
    defaultValues: {
      productImages: product.productImages,
      name: product.name ?? "",
      price: Number(product.price),
      description: product.description ?? "",
      categoryId: product.category.id ?? 0,
      qty: product.qty,
      isActive: product.isActive,
    },

    validators: {
      onSubmit: ({ value }) => {
        const result = productSchema.safeParse(value);
        if (result.success) return undefined;
        return result.error.flatten().fieldErrors;
      },
    },

    onSubmit: async ({ value }) => {
      // 1. Update Product Info
      await updateProduct({
        id: product.id,
        payload: value,
      });

      // 2. Upload New Images (Await all)
      if (uploadedFiles.length > 0) {
        const uploadPromises = uploadedFiles.map((file) =>
          uploadProductImage({
            id: product.id,
            request: file,
          })
        );
        await Promise.all(uploadPromises);
      }

      // 3. Delete Removed Images (Await all)
      if (deletedImageIds.length > 0) {
        const deletePromises = deletedImageIds.map((imageId) =>
          deleteProductImageMutate(imageId)
        );
        await Promise.all(deletePromises);
      }

      // 4. Clear state & close
      setUploadedFiles([]);
      setDeletedImageIds([]);
      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[40vw] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Edit product information below.</DialogDescription>
        </DialogHeader>
        <form
          id="ProductUpdateForm"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
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
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter product name"
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
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Product Price
                      </FieldLabel>
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
                        placeholder="Enter product price"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
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
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        name={field.name}
                        value={
                          field.state.value ? String(field.state.value) : ""
                        }
                        onValueChange={(v) => field.handleChange(Number(v))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLoading ? "Loading..." : "Select a category"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Product Categories</SelectLabel>
                            {data?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
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
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Product Quantity
                      </FieldLabel>
                      <Input
                        type="number"
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const v = e.target.value;
                          // ✅ qty តែងតែជា number មិន undefined
                          field.handleChange(v === "" ? 0 : Number(v));
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Enter qty"
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
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={isInvalid}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {field.state.value?.length ?? 0}/100 characters
                    </div>
                    <FieldDescription>
                      Include product details and features.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            {/* isActive Switch */}
            <form.Field
              name="isActive"
              children={(field) => {
                return (
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex gap-3">
                      <div className="font-medium">Product Status</div>
                      <div className="text-sm text-muted-foreground">
                        {field.state.value ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <Switch
                      checked={field.state.value ?? true}
                      onCheckedChange={(v) => field.handleChange(Boolean(v))}
                    />
                  </div>
                );
              }}
            />
            {/* Upload Image */}
            <div>
              <div
                className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                onClick={handleBoxClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="mb-2 bg-muted rounded-full p-3">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-pretty text-sm font-medium text-foreground">
                  Upload a project image
                </p>
                <p className="text-pretty text-sm text-muted-foreground mt-1">
                  or,{" "}
                  <label
                    htmlFor="fileUpload"
                    className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    click to browse
                  </label>{" "}
                  (4MB max)
                </p>
                <input
                  type="file"
                  id="fileUpload"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            </div>
            {/* Preview Image */}
            {product.productImages && product.productImages.length > 0 && (
              <div className="space-y-2">
                {product.productImages
                  .filter(
                    (image: ProductImage) =>
                      !deletedImageIds.includes(image.id),
                  )
                  .map((image: ProductImage, index: number) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-2 flex items-center gap-2"
                    >
                      <div className="w-15 aspect-square bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.fileName}
                          className="w-15 aspect-square object-cover"
                        />
                      </div>

                      <div className="flex-1 pr-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground truncate max-w-[250px]">
                              {image.fileName}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            type="button"
                            className="bg-transparent! hover:text-red-500"
                            onClick={() => {
                              setDeletedImageIds((prev) => [...prev, image.id]);
                              // deleteProductImageMutate(image.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* New Uploads Preview */}
            <div
              className={`pb-5 space-y-3 ${
                uploadedFiles.length > 0 ? "mt-4" : ""
              }`}
            >
              {uploadedFiles.map((file, index) => {
                const imageUrl = URL.createObjectURL(file);

                return (
                  <div
                    className="border border-border rounded-lg p-2 flex flex-col"
                    key={file.name + index}
                    onLoad={() => {
                      return () => URL.revokeObjectURL(imageUrl);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 pr-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground truncate max-w-[250px]">
                              {file.name}
                            </span>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {Math.round(file.size / 1024)} KB
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="bg-transparent! hover:text-red-500"
                            onClick={() => removeFile(file.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="ProductUpdateForm">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductUpdate;
