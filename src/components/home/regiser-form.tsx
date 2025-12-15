"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import toast from "react-hot-toast";
import { validatePassword } from "@/lib/auth/validate-password";
import { User } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validatePassword(password);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );
      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message || "Registration failed");
        return;
      }

      toast.success(data?.message || "Registration successful!");
      router.push("/login?registered=true");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-10 border border-border">
      <form onSubmit={handleCredentialsRegister} className="space-y-6">
        <div className="text-left space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="alice"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="pr-10 py-5 placeholder:text-muted-foreground placeholder:text-sm"
            />
            <User
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
          </div>

          {/* Password */}
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {/* Confirm Password */}
          <PasswordInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-6"
          disabled={isLoading || !username || !password || !confirmPassword}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          I already have an account.{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </form>
    </Card>
  );
}
