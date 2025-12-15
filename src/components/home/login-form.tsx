"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginAction(username, password);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <Card className="p-6 md:p-10 border border-border">
      <form onSubmit={handleCredentialsLogin} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="alice"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              className="pr-10 py-5"
            />
            <User
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
          </div>

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-6"
          disabled={isLoading || !username || !password}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Card>
  );
}
