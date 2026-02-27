import { DataTable } from "@/components/products/data-table";
import { columns } from "@/components/category/columnsCategory";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/services/category.service";
const Category: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategory,
  });

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
      <div>
        <Link to="/">
          <Button className="bg-amber-500">Go to Home Page</Button>
        </Link>
      </div>

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data?.data ?? []} />
      </div>
    </>
  );
};

export default Category;