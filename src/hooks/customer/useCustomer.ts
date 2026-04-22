import { useQuery } from "@tanstack/react-query";
import { fetchCustomer } from "@/services/customers.service";

export const useCustomer = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomer,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
};
