"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { FiltersSidebar } from "@/components/products/filters-sidebar";
import { CartButton } from "@/components/layout/cart-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";

interface Product {
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
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface FilterData {
  categories: { name: string; slug: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<FilterData>({
    categories: [],
    brands: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setPagination(data.pagination);
      setFilters(data.filters);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/products?${params}`);
  };

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`/products?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          {/* Top Navigation Bar */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-purple-600 hover:text-purple-700"
            >
              <span className="text-2xl">📱</span>
              <span>Dream Phones</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
              >
                Products
              </Link>
              <CartButton />
            </div>
          </div>

          {/* Page Title */}
          <h1 className="mb-4 text-3xl font-bold">All Products</h1>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <select
                  className="rounded-md border px-3 py-2 text-sm"
                  value={searchParams.get("sort") || "newest"}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-4">
              <FiltersSidebar
                categories={filters?.categories || []}
                brands={filters?.brands || []}
              />
            </div>
          </aside>

          {/* Sidebar - Mobile */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white p-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Close
                  </Button>
                </div>
                <FiltersSidebar
                  categories={filters?.categories || []}
                  brands={filters?.brands || []}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <p className="text-lg text-gray-600">No products found</p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/products")}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                {pagination && (
                  <p className="mb-4 text-sm text-gray-600">
                    Showing {products.length} of {pagination.total} products
                  </p>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          variant={
                            page === pagination.page ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(page)}
                          className="h-10 w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasMore}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
