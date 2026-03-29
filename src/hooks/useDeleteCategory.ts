import {ENV} from "@/app/config/env";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {toast} from "sonner";

const api = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id:number) =>{
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            console.log("Category deleted successfully");
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            console.error("Failed to delete category");
            toast.error("Failed to delete category");
        }
    })    
}