"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, MapPin, ShoppingBag, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowMenu(!showMenu)}
        className="relative"
      >
        <User className="h-5 w-5" />
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border bg-white shadow-lg">
            {/* User Info */}
            <div className="border-b p-4">
              <p className="font-semibold text-gray-900">
                {session.user?.name}
              </p>
              <p className="text-sm text-gray-600">{session.user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                href="/account/addresses"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                <MapPin className="h-4 w-4" />
                My Addresses
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                <ShoppingBag className="h-4 w-4" />
                My Orders
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t p-2">
              <button
                onClick={() => {
                  setShowMenu(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
