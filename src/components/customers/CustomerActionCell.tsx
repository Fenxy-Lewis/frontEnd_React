"use client";
import { useState } from "react";
import {
  SquarePen,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCustomer } from "@/hooks/customer/useUpdateCustomer";
import { deleteCustomer } from "@/services/customers.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CustomerType } from "@/Type/customer";

export function CustomerActionCell({
  row,
}: {
  row: { original: CustomerType };
}) {
  const customer = row.original;
  const queryClient = useQueryClient();
  const { mutateAsync: editCustomer, isPending: updating } =
    useUpdateCustomer();

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // View state
  const [viewOpen, setViewOpen] = useState(false);

  // ── Handlers ──

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCustomer(customer.id);
      toast.success(
        `"${customer.firstname} ${customer.lastname}" deleted successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await editCustomer({ ...customer, isActive: !customer.isActive });
    } catch {
      // error handled by hook
    }
  };

  const openEdit = () => {
    setEditForm({
      firstname: customer.firstname || "",
      lastname: customer.lastname || "",
      email: customer.email || "",
      phone: customer.phone || "",
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await editCustomer({ ...customer, ...editForm });
      setEditOpen(false);
    } catch {
      // error handled by hook
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1">
        {/* Edit */}
        <button
          onClick={openEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
          title="Edit customer"
        >
          <SquarePen className="h-4 w-4" />
        </button>

        {/* View */}
        <button
          onClick={() => setViewOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Hide / Show */}
        <button
          onClick={handleToggleVisibility}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
            customer.isActive
              ? "text-gray-400 hover:bg-amber-50 hover:text-amber-600"
              : "text-amber-500 hover:bg-emerald-50 hover:text-emerald-600"
          }`}
          title={customer.isActive ? "Hide customer" : "Show customer"}
        >
          {customer.isActive ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>

        {/* Delete */}
        <button
          onClick={() => setDeleteOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          title="Delete customer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-2">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <AlertDialogTitle className="text-lg">
              Delete Customer?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This will permanently delete{" "}
              <span className="font-semibold text-gray-900">
                {customer.firstname} {customer.lastname}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel disabled={deleting} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Edit Customer
            </DialogTitle>
            <DialogDescription>
              Update the customer's information below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  First Name
                </label>
                <Input
                  value={editForm.firstname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstname: e.target.value })
                  }
                  placeholder="First name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Name
                </label>
                <Input
                  value={editForm.lastname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastname: e.target.value })
                  }
                  placeholder="Last name"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder="+855 ..."
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={updating}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
            >
              {updating ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CircleCheck className="mr-1.5 h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Customer Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {(customer.firstname || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {customer.firstname} {customer.lastname}
                </p>
                <Badge
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-0 ${
                    customer.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {customer.isActive ? (
                    <CircleCheck className="h-3 w-3" />
                  ) : (
                    <CircleX className="h-3 w-3" />
                  )}
                  {customer.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-gray-900">
                    {customer.email || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm text-gray-900">
                    {customer.phone || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Joined
                  </p>
                  <p className="text-sm text-gray-900">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
