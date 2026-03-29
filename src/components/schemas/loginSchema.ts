import {z} from "zod"
export const loginSchema = z.object(
    {
        email:z.string().email({message:"Email មិនត្រឹមត្រូវ"}),
        password:z.string().min(6,{message:"Password យ៉ាងតិច ៦ តួអក្សរ...!"})
    }
)
export type LoginFormData = z.infer<typeof loginSchema>