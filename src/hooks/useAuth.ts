import { useMutation } from "@tanstack/react-query"
import { userLogin, type LoginPayload } from "@/services/auth.service";

export const useAuthLogin = () => {
    return useMutation({
        mutationFn: async ({ request }: { request: LoginPayload }) => {
            return await userLogin(request);
        },
        onError: (error: Error) => {
            console.log("Failed to Login...!",error.message)
        }
    });
};