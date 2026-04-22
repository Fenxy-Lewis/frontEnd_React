import { LoginForm } from "@/components/Login/loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
