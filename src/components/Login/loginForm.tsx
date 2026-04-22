import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { loginSchema } from "../schemas/loginSchema";
import { useAuthLogin } from "@/hooks/auth/useAuth";
import { setAcessToken } from "@/utils/tokenStorage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: authLogin } = useAuthLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      authLogin(
        { request: value },
        {
          onSuccess: (response: { token?: string; message?: string }) => {
            console.log("Login success from hook: ", response);
            if (response?.token) {
              setAcessToken(response?.token);
              navigate("/admin/home");
            } else {
              setError(response?.message || "Login failed");
            }
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="overflow-hidden rounded-2xl shadow-2xl shadow-gray-900/10 border border-gray-200/60">
        <div className="grid md:grid-cols-2">
          {/* ── Left Side — Branding & Animation ── */}
          <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-10 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-xl" />
            <div className="absolute top-1/4 right-10 h-20 w-20 rounded-full bg-white/5" />

            {/* Animation */}
            <div className="relative z-10 w-full max-w-xs">
              <DotLottieReact
                src="/animations/Login.json"
                loop
                autoplay
              />
            </div>

            {/* Branding text */}
            <div className="relative z-10 mt-6 text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome to Fenxy
              </h2>
              <p className="mt-2 text-sm text-emerald-100/80 max-w-xs leading-relaxed">
                Manage your business with a powerful and intuitive dashboard
              </p>
            </div>

            {/* Trust badges */}
            <div className="relative z-10 mt-8 flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">99.9%</span>
                <span className="text-[11px] text-emerald-100/70">Uptime</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">256-bit</span>
                <span className="text-[11px] text-emerald-100/70">SSL Encryption</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-[11px] text-emerald-100/70">Support</span>
              </div>
            </div>
          </div>

          {/* ── Right Side — Login Form ── */}
          <div className="bg-white p-8 md:p-10 lg:p-12">
            <form
              id="loginForm"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                {/* Header */}
                <div className="flex flex-col gap-2 mb-2">
                  {/* Mobile only logo */}
                  <div className="flex md:hidden items-center gap-2 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Fenxy</span>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Sign in to your account
                  </h1>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Enter your credentials to access the dashboard
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-sm font-semibold text-gray-700"
                        >
                          Email Address
                        </FieldLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input
                            id={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="you@example.com"
                            aria-invalid={isInvalid}
                            className="pl-10 h-11 rounded-lg border-gray-300 bg-gray-50/50 text-sm transition-all focus:bg-white focus:border-emerald-400 focus:ring-emerald-500/20"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Password Field */}
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex items-center justify-between">
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-sm font-semibold text-gray-700"
                          >
                            Password
                          </FieldLabel>
                          <a
                            href="#"
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <Input
                            id={field.name}
                            type={showPassword ? "text" : "password"}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter your password"
                            aria-invalid={isInvalid}
                            className="pl-10 pr-10 h-11 rounded-lg border-gray-300 bg-gray-50/50 text-sm transition-all focus:bg-white focus:border-emerald-400 focus:ring-emerald-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Submit Button */}
                <Field>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Field>

                {/* Divider */}
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white">
                  Or continue with
                </FieldSeparator>

                {/* Social Login Buttons */}
                <Field className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 rounded-lg border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Apple</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 rounded-lg border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="h-11 rounded-lg border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                      <path
                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Meta</span>
                  </Button>
                </Field>

                {/* Sign Up Link */}
                <FieldDescription className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Create account
                  </a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400">
        By continuing, you agree to our{" "}
        <a href="#" className="text-gray-500 underline underline-offset-2 hover:text-emerald-600 transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-gray-500 underline underline-offset-2 hover:text-emerald-600 transition-colors">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
