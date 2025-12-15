"use server";

import { cookies } from "next/headers";

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

export async function refreshAccessToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return { success: false, message: "No refresh token found" };
    }

    const res = await fetch(`${process.env.API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        return {
          success: false,
          message: "Session expired",
          shouldRedirect: true,
        };
      }
      return { success: false, message: "Failed to refresh token" };
    }

    const data = await res.json();

    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 900,
      path: "/",
    });

    return { success: true, accessToken: data.accessToken };
  } catch (error) {
    return { success: false, message: "Something went wrong during refresh" };
  }
}

export async function validateAndRefreshToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return { isValid: false, shouldRedirect: true };
  }

  if (accessToken) {
    return { isValid: true, shouldRedirect: false };
  }

  const refreshResult = await refreshAccessToken();

  if (refreshResult.success) {
    return { isValid: true, shouldRedirect: false };
  }

  return {
    isValid: false,
    shouldRedirect: refreshResult.shouldRedirect || false,
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}
