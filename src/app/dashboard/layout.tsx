import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAndRefreshToken } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const validation = await validateAndRefreshToken();

  if (!validation.isValid) {
    redirect("/login");
  }

  return <>{children}</>;
}
