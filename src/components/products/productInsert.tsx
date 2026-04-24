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
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useUploadProductImage } from "@/hooks/product/useUploadProductImage";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// ✅ កែ type name មិនឱ្យ conflict
export const ProductInsert = ({ open, setOpen }: Props) => {
  const queryClient = useQueryClient(); // ✅ ប្រើ hook ជំនួស
  const { data, isLoading } = useCategories();
  const { mutateAsync: createProduct } = useCreateProduct();

  // Image Form Upload
  const { mutateAsync: uploadProductImage } = useUploadProductImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {},
  );

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
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
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };
  // Image Form Upload END

  const form = useForm({
    defaultValues: {
      name: "",
      price: undefined as number | undefined,
      description: "",
      categoryId: 0,
      qty: 0,
      isActive: true, // ✅ បន្ថែម isActive
      productImages: [] as File[], // ✅ បន្ថែម
    },

    validators: {
      onSubmit: ({ value }) => {
        const result = productSchema.safeParse({
          ...value,
          // ✅ map uploadedFiles ឱ្យ match object shape
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
        productImages: undefined, // Files are uploaded separately below
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
      queryClient.invalidateQueries({ queryKey: ["products"] }); // ✅ invalidate products query
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
        className="sm:max-w-[40vw] h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Product Form</DialogTitle>
          <DialogDescription>
            Insert a new product into the system.
          </DialogDescription>
        </DialogHeader>

        <form
          id="ProductInsertForm"
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
                      rows={6}
                      className="min-h-15 resize-none"
                      aria-invalid={isInvalid}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {field.state.value.length}/100 characters
                    </div>
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
                      checked={field.state.value ?? true} // ✅ fallback
                      onCheckedChange={(v) => field.handleChange(Boolean(v))}
                    />
                  </div>
                );
              }}
            />
            {/* Upload Image */}
            {/* <div>
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
            </div> */}

            {/* Upload Image Field */}
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
                  <div className="space-y-2">
                    <div
                      className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        isInvalid ? "border-red-500 bg-red-50" : "border-border"
                      }`}
                      onClick={handleBoxClick}
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        handleDrop(e);
                        // ប្រសិនបើ handleDrop របស់អ្នកមិនទាន់បាន update field
                        // អ្នកអាចទាញយក files មកហៅ field.handleChange(files) នៅទីនេះ
                      }}
                    >
                      <div className="mb-2 bg-muted rounded-full p-3">
                        <Upload
                          className={`h-5 w-5 ${isInvalid ? "text-red-500" : "text-muted-foreground"}`}
                        />
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
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleFileSelect(files);
                            // សំខាន់៖ ត្រូវ update ទៅកាន់ TanStack Form
                            field.handleChange([
                              ...field.state.value,
                              ...Array.from(files),
                            ]);
                          }
                        }}
                      />
                    </div>

                    {/* បង្ហាញ Error Message */}
                    {isInvalid && (
                      <p className="text-sm font-medium text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Preview Image */}
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
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${fileProgresses[file.name] || 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.round(fileProgresses[file.name] || 0)}%
                          </span>
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
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="ProductInsertForm"
            className="cursor-pointer"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInsert;
