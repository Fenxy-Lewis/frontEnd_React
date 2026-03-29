import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { categorySchema } from "../schemas/categorySchema";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useQueryClient } from "@tanstack/react-query";

type CategoryValues = z.infer<typeof categorySchema>;
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CategoryInsert({ open, setOpen }: Props) {
  const queryClient = useQueryClient(); // ✅ ប្រើ hook ជំនួស
  const createCategory = useCreateCategory(); // ✅ ហៅ hook ត្រឹមត្រូវ

  const form = useForm<CategoryValues>({
    defaultValues: { name: "", is_active: true },
    validators: {
      onSubmit: ({ value }) => {
        const result = categorySchema.safeParse(value);
        if (result.success) return undefined;
        return result.error.flatten().fieldErrors;
      },
    },
    onSubmit: async ({ value }) => {
      await createCategory.mutateAsync({ // ✅ ប្រើ instance ដែលបានហៅ
        name: value.name.trim(),
        is_active: value.active || true,
      });
      // ✅ ដាក់ logic នៅទីនេះវិញ
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Insert Category</DialogTitle>
          <DialogDescription>Create a new category.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. ASSOCIATIONS"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="active"
              children={(field) => {
                return (
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel>Active</FieldLabel>
                    </FieldContent>

                    <div className="flex items-center justify-end">
                      <Switch
                        checked={field.state.value}
                        onCheckedChange={(v) => field.handleChange(Boolean(v))}
                      />
                    </div>
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}