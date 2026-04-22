import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProductImage } from "@/services/product.service";
import { toast } from "sonner";

export const useUploadProductImage = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({id,request}:{id:number, request:File})=> {
            return uploadProductImage(id,request)
        },
        onSuccess:()=>{
            toast.success("Product Image Upload Successfully..!");
            queryClient.invalidateQueries({queryKey:["products"]})
        },
        onError:()=>{
            toast.error("Product Image Upload Failed..!")
        }
     })
}
