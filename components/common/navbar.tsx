"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/components/providers/user-store";
import { UserRole } from "@/generated/prisma";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    }

    logout();
    router.push("/auth/login");
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getHomeLink = () => {
    if (!user) return "/home";
    return user.role === UserRole.CUSTOMER ? "/customer/home" : "/organization/home";
  };

  const getBookingsLink = () => {
    if (!user) return "/bookings";
    return user.role === UserRole.CUSTOMER
      ? "/customer/bookings"
      : "/organization/bookings";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex items-center justify-between h-16">
          <Link href={getHomeLink()} className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-green-800">
              Eat<span className="text-orange-400">UP</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="ring-2 cursor-pointer ring-green-200 hover:ring-green-300 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br p-2 from-green-500 to-green-600 text-white font-semibold text-sm shadow-inner">
                      {getInitials(user.name, user.surname)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm"
                  align="end"
                  forceMount
                  sideOffset={8}
                >
                  {user.role !== UserRole.ADMIN && (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer p-3 rounded-md hover:bg-green-50 transition-colors duration-150 focus:bg-green-50 focus:text-green-700"
                        onClick={() => router.push(getBookingsLink())}
                      >
                        <User className="w-4 h-4 mr-3 text-green-600" />
                        <span className="font-medium">Rezervasyonlarım</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-2" />
                    </>
                  )}

                  <DropdownMenuItem
                    className="cursor-pointer p-3 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 focus:bg-red-50 focus:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="relative h-12 w-12 rounded-full ring-2 ring-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
