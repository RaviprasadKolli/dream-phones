"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ImageGallery } from "@/components/products/image-gallery";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Heart,
  Share2,
  Package,
  Shield,
  Truck,
  ChevronLeft,
  Loader2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  quantity: number;
  specifications: any;
  warranty: string | null;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${params.slug}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const data = await response.json();
      setProduct(data.product);
      setRelatedProducts(data.relatedProducts);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart! 🎉",
      description: `${product?.name} (${selectedQuantity}x) added to your cart`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Redirecting to checkout...",
      description: "Taking you to secure checkout",
    });
    // Will implement checkout later
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-purple-600">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-purple-600"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Images */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand.logo ? (
              <img
                src={product.brand.logo}
                alt={product.brand.name}
                className="h-8"
              />
            ) : (
              <p className="text-sm text-gray-500">{product.brand.name}</p>
            )}

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="mt-2 text-gray-600">
                {product.shortDesc || product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-y py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Inclusive of all taxes
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {isOutOfStock ? (
                <p className="text-red-600 font-semibold">⚠️ Out of Stock</p>
              ) : isLowStock ? (
                <p className="text-orange-600 font-semibold">
                  ⚡ Only {product.quantity} left in stock!
                </p>
              ) : (
                <p className="text-green-600 font-semibold">✓ In Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center rounded-md border">
                  <button
                    onClick={() =>
                      setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedQuantity(
                        Math.min(product.quantity, selectedQuantity + 1)
                      )
                    }
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={selectedQuantity >= product.quantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Buy Now
              </Button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Features */}
            <div className="rounded-lg border bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-600">
                      On orders above ₹500
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm">Warranty</p>
                    <p className="text-xs text-gray-600">
                      {product.warranty || "1 Year"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">
                      7 days return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-12 rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold">Specifications</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b pb-2">
                  <span className="w-1/3 font-semibold capitalize text-gray-700">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="w-2/3 text-gray-600">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mt-8 rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
