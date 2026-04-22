import React, { useState, useMemo, useEffect } from "react";
import { useProductsExpire, useCheckAndNotifyExpiring, useDeleteProductExpire } from "@/hooks/product/useProductsExpire";
import { toast } from "sonner";
import { getAcessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  RefreshCw,
  Timer,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Bell,
} from "lucide-react";
import { DataTable } from "@/components/products/data-table";
import { columnsProductExpire } from "@/components/products/columnsProductExpire";
import type { ProductExpireType } from "@/Type/productExpire";
import ProductExpireInsert from "@/components/products/productExpireInsert";

const ProductControllExpire: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openInsert, setOpenInsert] = useState(false);

  const { mutateAsync: checkAndNotify, isPending: isNotifying } = useCheckAndNotifyExpiring();

  const { mutateAsync: deleteExpire } = useDeleteProductExpire();

  // Auto-trigger the check once per day when this page loads
  useEffect(() => {
    const lastChecked = sessionStorage.getItem("last_auto_notify_check");
    const today = new Date().toDateString();
    if (lastChecked !== today) {
      checkAndNotify()
        .then(() => {
          sessionStorage.setItem("last_auto_notify_check", today);
        })
        .catch(() => {
          // Ignore failure silently so it doesn't disturb user flow
        });
    }
  }, [checkAndNotify]);

  const { data, isLoading, isError, error, isFetching } = useProductsExpire(
    searchQuery,
    page,
    limit,
    statusFilter !== "all" ? statusFilter : undefined
  );

  // Auth check
  const accessToken = getAcessToken();
  if (!accessToken) {
    navigate("/");
  }

  // Data processing and filtering
  const rawList: ProductExpireType[] = useMemo(() => {
    let list = Array.isArray(data) ? data : data?.data ?? [];

    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      list = list.filter((item: ProductExpireType) => 
        item.product?.name?.toLowerCase().includes(lowerQ) || 
        item.batchNumber?.toLowerCase().includes(lowerQ)
      );
    }

    if (statusFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      list = list.filter((item: ProductExpireType) => {
        const expDate = new Date(item.expiryDate);
        expDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (statusFilter === "expired") return diffDays <= 0;
        if (statusFilter === "soon") return diffDays > 0 && diffDays <= 30;
        if (statusFilter === "safe") return diffDays > 30;
        return true;
      });
    }

    return list;
  }, [data, searchQuery, statusFilter]);
  
  // Auto-delete expired products once per day
  useEffect(() => {
    const lastAutoDelete = sessionStorage.getItem("last_auto_delete_expired");
    const todayStr = new Date().toDateString();

    if (lastAutoDelete !== todayStr && rawList?.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiredItems = rawList.filter((item) => {
        const expDate = new Date(item.expiryDate);
        expDate.setHours(0, 0, 0, 0);
        return expDate.getTime() <= today.getTime();
      });

      if (expiredItems.length > 0) {
        let deletedCount = 0;
        const deletePromises = expiredItems.map(async (item) => {
          if (item.id) {
            try {
              await deleteExpire(item.id);
              deletedCount++;
            } catch {
              // Ignore individual delete errors
            }
          }
        });

        Promise.all(deletePromises).then(() => {
          sessionStorage.setItem("last_auto_delete_expired", todayStr);
          if (deletedCount > 0) {
            toast.success(`Auto-deleted ${deletedCount} expired product(s).`);
          }
        });
      } else {
        // Mark as checked even if no expired items
        sessionStorage.setItem("last_auto_delete_expired", todayStr);
      }
    }
  }, [rawList, deleteExpire]);

  // NOTE: If the backend pagination isn't ready and returns everything, 
  // we do local pagination. If backend paginates, use the API's pagination.
  // Assuming 'rawList' are the results.

  const totalItems = data?.pagination?.totalItems ?? rawList.length;
  const totalPages = data?.pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / limit));
  
  // For UI stats, if the API doesn't return overall stats, we derive from available list 
  // (In a real app, stats would be fetched from a separate endpoint or meta data)
  const stats = useMemo(() => {
    let expired = 0;
    let soon = 0;
    let safe = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    rawList.forEach((item) => {
      const expDate = new Date(item.expiryDate);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) expired++;
      else if (diffDays <= 30) soon++;
      else safe++;
    });

    return { total: rawList.length, expired, soon, safe };
  }, [rawList]);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
          <p className="text-sm font-medium text-gray-500">
            Loading expiry data...
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
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-600">
            Failed to load expiry tracking data
          </p>
          <p className="text-xs text-gray-400">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <Timer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Expiry Control
            </h1>
            <p className="text-xs text-gray-500">
              Monitor and manage product expiration dates.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => checkAndNotify()}
            disabled={isNotifying}
            variant="outline"
            className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-all duration-300"
          >
            {isNotifying ? (
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
            ) : (
              <Bell className="mr-1.5 h-4 w-4" />
            )}
            Notify Expiring
          </Button>

          <Button
            onClick={() => setOpenInsert(true)}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:from-amber-600 hover:to-orange-700 hover:shadow-xl hover:shadow-amber-500/30"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Set Expire to Product
          </Button>
        </div>
      </div>

      <ProductExpireInsert open={openInsert} setOpen={setOpenInsert} />

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Tracking */}
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 truncate">
              {stats.total}
            </p>
            <p className="text-xs font-medium text-gray-500">Total Tracked</p>
          </div>
        </div>

        {/* Safe */}
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200/50 bg-emerald-50/10 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/50">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700 truncate">{stats.safe}</p>
            <p className="text-xs font-medium text-emerald-600/70">Safe (&gt; 30 Days)</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="flex items-center gap-4 rounded-2xl border border-amber-200/50 bg-amber-50/20 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/60">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700 truncate">{stats.soon}</p>
            <p className="text-xs font-medium text-amber-600/70">Expiring Soon</p>
          </div>
        </div>
        
        {/* Expired */}
        <div className="flex items-center gap-4 rounded-2xl border border-red-200/50 bg-red-50/20 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100/60">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-700 truncate">{stats.expired}</p>
            <p className="text-xs font-medium text-red-600/70">Expired</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name..."
            className="pl-10 pr-10 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
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

        <div className="flex items-center gap-4 shrink-0">
          {/* Status Filter */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Filter
            </span>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px] rounded-lg border-gray-200 bg-gray-50/80 text-sm h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="soon">Expiring Soon</SelectItem>
                  <SelectItem value="safe">Safe</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-px h-6 bg-gray-200"></div>

          {/* Rows per page */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Rows
            </span>
            <Select
              value={String(limit)}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] rounded-lg border-gray-200 bg-gray-50/80 text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fetching indicator */}
        {isFetching && (
          <div className="flex items-center gap-2 shrink-0 text-amber-600 ml-2">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs font-medium">Updating...</span>
          </div>
        )}
      </div>

      {/* ── Data Table ── */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
        <DataTable columns={columnsProductExpire} data={rawList} />
      </div>

      {/* ── Pagination ── */}
      {totalPages > 0 && (
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
                            ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600 hover:text-white"
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
    </div>
  );
};

export default ProductControllExpire;
