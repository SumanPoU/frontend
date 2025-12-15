import { Button } from "@/components/ui/button";
import { logoutAction, getCurrentUser, DecodedUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function DashboardHeader() {
  const user: DecodedUser | null = await getCurrentUser();

  async function handleLogout() {
    "use server";
    await logoutAction();
    redirect("/login");
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container max-w-7xl mx-auto px-4  py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 ">
                <Avatar className="w-10 h-10">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                  ) : (
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* User Info */}
              <DropdownMenuLabel className="flex flex-col items-start space-y-1">
                <span className="font-semibold">Hi👋, {user.username}</span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
