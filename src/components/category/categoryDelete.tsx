// components/category/CategoryDelete.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryId: number;
  categoryName?: string;
}

export function CategoryDelete({
  open,
  setOpen,
  categoryId,
  categoryName,
}: Props) {
  const { mutateAsync: DeleteCategory, isPending } = useDeleteCategory();

  const handleDelete = async () => {
    await DeleteCategory(categoryId);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <DotLottieReact
            src="/animations/Delete Files Loop.json"
            loop
            autoplay
            style={{ width: 220, height: 220, margin: "0 auto" }}
          />
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-semibold text-foreground">
              {categoryName ?? "this category"}
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
