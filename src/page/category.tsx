import { DataTable } from "@/components/products/data-table";
import { columns } from "@/components/category/columnsCategory";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useCategories } from "@/hooks/useCategories";
import { CategoryInsert } from "@/components/category/categoryInsert";
import React, { useState } from "react";
import { getAcessToken } from "@/utils/tokenStorage";

const Category: React.FC = () => {
  // Use the custom hook to fetch categories
  const { data, isLoading, isError, error } = useCategories();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
    const accessToken=getAcessToken();
    if(!accessToken){
      navigate("/");
    }
  if (isLoading) {
    return (
      <div className="flex place-content-center p-4 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 flex place-content-center text-2xl font-bold">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
<div className="flex justify-between items-center">
        <div>
        <Link to="/">
          <Button className="bg-amber-500">Go to Home Page</Button>
        </Link>
      </div>
      <div>
        <Button onClick={() => setOpen(true)} className="bg-blue-600">
          Add More
        </Button>
        <CategoryInsert open={open} setOpen={setOpen} />
      </div>
</div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </>
  );
};

export default Category;
