import { RegisterForm } from "@/components/home/regiser-form";

export const metadata = {
  title: "Register",
  description: "Create a new account",
};

export default async function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center sm:px-4 ">
      <div className="w-full max-w-xl">
        <RegisterForm />
      </div>
    </main>
  );
}
