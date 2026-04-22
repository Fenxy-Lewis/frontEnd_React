import { useMutation } from "@tanstack/react-query"
import { userLogin } from "@/services/auth.service";
import type { LoginPayload } from "@/Type/LoginPayload";

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
