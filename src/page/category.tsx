import { DataTable } from "@/components/products/data-table";
import { columns } from "@/components/category/columnsCategory";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/category/useCategories";
import { CategoryInsert } from "@/components/category/CategoryInsert";
import React, { useState } from "react";
import { getAcessToken } from "@/utils/tokenStorage";
import {
  Plus,
  Component,
  RefreshCw,
  Package,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CategoryType } from "@/Type/category";

const Category: React.FC = () => {
  const { data, isLoading, isError, error } = useCategories();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const accessToken = getAcessToken();
  if (!accessToken) {
    navigate("/");
  }

  // Filter categories by search
  const filteredCategories = (data ?? []).filter((cat: CategoryType) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = (data ?? []).filter(
    (cat: CategoryType) => cat.is_active
  ).length;
  const inactiveCount = (data ?? []).length - activeCount;

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="text-sm font-medium text-gray-500">
            Loading categories...
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
            Failed to load categories
          </p>
          <p className="text-xs text-gray-400">
            {(error as Error).message}
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Component className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Categories
            </h1>
            <p className="text-xs text-gray-500">
              {(data ?? []).length} total categories
            </p>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:from-violet-600 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/30"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Category
        </Button>
        <CategoryInsert open={open} setOpen={setOpen} />
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <Component className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {(data ?? []).length}
            </p>
            <p className="text-xs text-gray-500">Total Categories</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <Component className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700">
              {activeCount}
            </p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
            <Component className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {inactiveCount}
            </p>
            <p className="text-xs text-gray-500">Inactive</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search ── */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name..."
            className="pl-10 pr-10 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
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

        <p className="text-xs text-gray-500 shrink-0">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredCategories.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {(data ?? []).length}
          </span>{" "}
          categories
        </p>
      </div>

      {/* ── Data Table ── */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filteredCategories} />
      </div>
    </div>
  );
};

export default Category;
