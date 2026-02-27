import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/products/data-table";
import { columns } from "../components/products/columnsProduct";
import { fetchProducts } from "@/services/product.service";
import { useDebounce } from "@/hooks/useDebounce";

const Product: React.FC = () => {
  const [keyword, setKeyword] = useState("");

  // ✅ debounce keyword ដើម្បីកុំ call API រាល់ keypress
  const debouncedKeyword = useDebounce(keyword, 500);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", debouncedKeyword],
    queryFn: () => fetchProducts(debouncedKeyword),
    enabled: true,
    placeholderData: (previousData) => previousData,
  });

  const handleClear = () => setKeyword("");

  if (isLoading)
    return <div className="flex place-content-center p-4 text-2xl font-bold">Loading...</div>;

  if (isError)
    return (
      <div className="p-4 text-red-500 flex place-content-center text-2xl font-bold">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <div className="container mx-auto">
      <div className="w-[320px] mb-4 mt-4 flex gap-2">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Type to search..."
        />
        <Button variant="outline" onClick={handleClear} disabled={isFetching}>
          Clear
        </Button>
      </div>

      {/* ✅ Optional: បង្ហាញស្ថានភាពកំពុងស្វែងរក */}
      {isFetching && <div className="mb-2 text-sm">Searching...</div>}

      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default Product;