"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Link href="/cart">
      <Button variant="outline" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
}
