import { z } from "zod"

export const registerSchema = z.object({
  firstName: z.string()
    .min(2, "First name យ៉ាងតិច 2 characters"),

  lastName: z.string()
    .min(2, "Last name យ៉ាងតិច 2 characters"),

  email: z.string()
    .email("Email មិនត្រឹមត្រូវ"),

  userName: z.string()
    .min(3, "Username យ៉ាងតិច 3 characters"),

  password: z.string()
    .min(6, "Password យ៉ាងតិច 6 characters"),

  confirmPassword: z.string(),

  gender: z.enum(["male", "female"], {
    message: "សូមជ្រើសរើស gender",
  }),

  phone: z.string()
    .min(9, "Phone យ៉ាងតិច 9 digits")
    .max(10, "Phone មិនអាចលើស 10 digits"),
})
// ✅ ពិនិត្យ password និង confirmPassword ដូចគ្នា
.refine((data) => data.password === data.confirmPassword, {
  message: "Password មិនដូចគ្នា",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>