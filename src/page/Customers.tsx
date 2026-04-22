import React, { useState, useMemo } from "react";
import { useCustomer } from "@/hooks/customer/useCustomer";
import { getAcessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";
import { useCreateCustomer } from "@/hooks/customer/useCreateCustomer";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  X,
  Plus,
  RefreshCw,
  ShoppingCart,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { DataTable } from "@/components/products/data-table";
import { columnsCustomer } from "@/components/customers/columnsCustomer";
import type { CustomerType } from "@/Type/customer";

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useCustomer();
  const { mutateAsync: createNewCustomer, isPending: creating } =
    useCreateCustomer();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
  });

  // Auth check
  const accessToken = getAcessToken();
  if (!accessToken) {
    navigate("/");
  }

  // Customers data
  const customers: CustomerType[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : (data.data ?? []);
  }, [data]);

  // Filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.firstname?.toLowerCase().includes(q) ||
        c.lastname?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q),
    );
  }, [customers, searchQuery]);

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const paginatedData = filtered.slice((page - 1) * limit, page * limit);

  // Stats
  const activeCount = customers.filter((c) => c.isActive).length;
  const inactiveCount = customers.length - activeCount;

  // ── Handlers ──

  const handleCreateCustomer = async () => {
    if (!createForm.firstname.trim() || !createForm.email.trim()) {
      toast.error("First name and email are required");
      return;
    }
    try {
      await createNewCustomer(createForm as unknown as CustomerType);
      setCreateOpen(false);
      setCreateForm({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        phone: "",
      });
    } catch {
      // error handled by hook
    }
  };

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-sm font-medium text-gray-500">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
            <Users className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-600">
            Failed to load customers
          </p>
          <p className="text-xs text-gray-400">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Customers
            </h1>
            <p className="text-xs text-gray-500">
              {customers.length} total customers • Page {page} of {totalPages}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {customers.length}
            </p>
            <p className="text-xs text-gray-500">Total Customers</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700">{activeCount}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <UserX className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700">{inactiveCount}</p>
            <p className="text-xs text-gray-500">Hidden</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or phone..."
            className="pl-10 pr-10 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            Rows per page
          </span>
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[80px] rounded-lg border-gray-200 bg-gray-50/80 text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="center">
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
        <DataTable columns={columnsCustomer} data={paginatedData} />
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((page - 1) * limit + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(page * limit, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{totalItems}</span>{" "}
            results
          </p>

          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  aria-disabled={page === 1}
                  className={`rounded-lg text-sm ${
                    page === 1
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer hover:bg-gray-100"
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={page === pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`cursor-pointer rounded-lg text-sm ${
                          page === pageNum
                            ? "bg-blue-500 border-blue-500 hover:bg-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  aria-disabled={page === totalPages}
                  className={`rounded-lg text-sm ${
                    page === totalPages
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer hover:bg-gray-100"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ── Create Customer Dialog ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  New Customer
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Fill in the details to create a new customer.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  First Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={createForm.firstname}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        firstname: e.target.value,
                      })
                    }
                    placeholder="John"
                    className="pl-10 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={createForm.lastname}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, lastname: e.target.value })
                    }
                    placeholder="Doe"
                    className="pl-10 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  @
                </span>
                <Input
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  placeholder="johndoe"
                  className="pl-9 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, phone: e.target.value })
                  }
                  placeholder="+855 12 345 678"
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setCreateForm({
                  firstname: "",
                  lastname: "",
                  username: "",
                  email: "",
                  phone: "",
                });
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={creating}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
            >
              {creating ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Create Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
