import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    category: {
      name: string;
      slug: string;
    };
    brand: {
      name: string;
      slug: string;
    };
    quantity: number;
    isFeatured: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gray-100"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="rounded bg-purple-600 px-2 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded bg-white px-4 py-2 font-semibold text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Category */}
        <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
          <span>{product.brand.name}</span>
          <span>•</span>
          <span>{product.category.name}</span>
        </div>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-purple-600"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button className="mt-3 w-full" size="sm" disabled={isOutOfStock}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
