"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface DecodedUser {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}

export async function loginAction(username: string, password: string) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data?.message || "Login failed" };
    }

    // Set cookies on server side
    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900,
      path: "/",
    });

    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800,
      path: "/",
    });

    return { success: true, message: data.message || "Login successful" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getCurrentUser(): Promise<DecodedUser | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const decoded: DecodedUser = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
