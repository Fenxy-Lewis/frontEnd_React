import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/products/data-table";
import { columns } from "../components/products/columnsProduct";
import { fetchProducts } from "@/services/product.service";
import { useDebounce } from "@/hooks/useDebounce";
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
import { Plus } from "lucide-react";

const Product: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // ✅ អាច update បាន
  const navigate = useNavigate();

  const debouncedKeyword = useDebounce(keyword, 500);

  // ✅ reset page នៅពេល search ផ្លាស់ប្តូរ
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", page, limit, debouncedKeyword],
    queryFn: () => fetchProducts(debouncedKeyword, page, limit),
    enabled: true,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });

  const handleClear = () => setKeyword("");
  const totalPages = data?.pagination?.totalPages ?? 1;

  if (isLoading)
    return (
      <div className="flex place-content-center p-4 text-2xl font-bold">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="p-4 text-red-500 flex place-content-center text-2xl font-bold">
        Error: {(error as Error).message}
      </div>
    );

  const accessToken = getAcessToken();
  if (!accessToken) {
    navigate("/");
  }
  return (
    <div className="container mx-auto w-full">
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="w-[320px] mb-4 mt-4 flex gap-2">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type to search..."
          />
          <Button variant="default" onClick={handleClear} disabled={isFetching}>
            Clear
          </Button>
        </div>
        <div>
          <Button variant="default" onClick={() => setOpen(true)}>
            <Plus /> Add More
          </Button>
          <ProductInsert open={open} setOpen={setOpen} />
        </div>
      </div>

      {isFetching && <div className="mb-2 text-sm">Searching...</div>}

      <DataTable columns={columns} data={data?.data ?? []} />

      <div className="flex items-center justify-between w-full mt-3">
        {/* ✅ Rows per page — ភ្ជាប់ទៅ limit state */}
        <div className="w-full flex items-center">
          <p className="mr-4">Rows per page</p>
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1); // reset page
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Pagination — dynamic */}
        <Pagination className="w-full">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              // បង្ហាញតែ pages ជិត current page
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
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              // បង្ហាញ ellipsis
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
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Product;
