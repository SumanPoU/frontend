import { LoginForm } from "@/components/home/login-form";

export const metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default async function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center sm:px-4 ">
      <div className="w-full max-w-xl">
        <LoginForm />
      </div>
    </main>
  );
}
