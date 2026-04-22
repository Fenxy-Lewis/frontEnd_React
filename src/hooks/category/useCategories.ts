import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/services/category.service";

export const useCategories = () =>{
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategory,
        staleTime:1000*60*1, // 5 minutes
        gcTime:1000*60*30, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        placeholderData: (previousData) => previousData,
    });
}
