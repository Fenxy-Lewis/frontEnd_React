import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/products/data-table";
import { columns } from "../components/products/columnsProduct";
import { useDebounce } from "@/hooks/debounce/useDebounce";
import { useProducts } from "@/hooks/product/useProducts";
import { ProductInsert } from "@/components/products/productInsert";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAcessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Package,
  SquareTerminal,
  RefreshCw,
  X,
} from "lucide-react";

const Product: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const debouncedKeyword = useDebounce(keyword, 500);
  const [prevKeyword, setPrevKeyword] = useState(debouncedKeyword);

  if (prevKeyword !== debouncedKeyword) {
    setPrevKeyword(debouncedKeyword);
    setPage(1);
  }

  const { data, isLoading, isError, error, isFetching } = useProducts(
    debouncedKeyword,
    page,
    limit,
  );

  const handleClear = () => setKeyword("");
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalItems = data?.pagination?.totalItems ?? 0;

  // Auth check
  const accessToken = getAcessToken();
  if (!accessToken) {
    navigate("/");
  }

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="text-sm font-medium text-gray-500">
            Loading products...
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
            <Package className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-600">
            Failed to load products
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <SquareTerminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Products
            </h1>
            <p className="text-xs text-gray-500">
              {totalItems} total products • Page {page} of {totalPages}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Product
        </Button>
        <ProductInsert open={open} setOpen={setOpen} />
      </div>

      {/* ── Toolbar: Search + Filters ── */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products by name..."
            className="pl-10 pr-10 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          {keyword && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Rows per page */}
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

        {/* Fetching indicator */}
        {isFetching && (
          <div className="flex items-center gap-2 shrink-0 text-emerald-600">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs font-medium">Updating...</span>
          </div>
        )}
      </div>

      {/* ── Data Table ── */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>

      {/* ── Pagination ── */}
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
                          ? "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
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
    </div>
  );
};

export default Product;
