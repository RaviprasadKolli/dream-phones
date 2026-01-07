"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface FiltersSidebarProps {
  categories: { name: string; slug: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
}

export function FiltersSidebar({ categories, brands }: FiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- Applied filters (URL) ---------------- */
  const appliedCategories =
    searchParams.get("category")?.split(",").filter(Boolean) || [];
  const appliedBrands =
    searchParams.get("brand")?.split(",").filter(Boolean) || [];
  const appliedMinPrice = searchParams.get("minPrice") || "";
  const appliedMaxPrice = searchParams.get("maxPrice") || "";

  /* ---------------- Draft filters (local state) ---------------- */
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(appliedCategories);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(appliedBrands);
  const [minPrice, setMinPrice] = useState(appliedMinPrice);
  const [maxPrice, setMaxPrice] = useState(appliedMaxPrice);

  /* Sync draft state when URL changes */
  useEffect(() => {
    setSelectedCategories(appliedCategories);
    setSelectedBrands(appliedBrands);
    setMinPrice(appliedMinPrice);
    setMaxPrice(appliedMaxPrice);
  }, [
    appliedCategories.join(","),
    appliedBrands.join(","),
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  /* ---------------- Dropdown states ---------------- */
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  /* ---------------- Local toggles (NO API CALL) ---------------- */
  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
  };

  /* ---------------- Apply Filters ---------------- */
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","));
    }

    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  const hasDraftFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice ||
    maxPrice;

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          {hasDraftFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-purple-600"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="rounded-lg border bg-white">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex w-full items-center justify-between p-4 font-semibold"
          >
            Categories
            {categoryOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {categoryOpen && (
            <div className="border-t p-4 space-y-2">
              {categories.map((category) => (
                <label
                  key={category.slug}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => toggleCategory(category.slug)}
                  />
                  <span className="flex-1 text-sm">{category.name}</span>
                  <span className="text-xs text-gray-500">
                    ({category.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="rounded-lg border bg-white">
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex w-full items-center justify-between p-4 font-semibold"
          >
            Brands
            {brandOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {brandOpen && (
            <div className="border-t p-4 space-y-2 max-h-80 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand.slug}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.slug)}
                    onChange={() => toggleBrand(brand.slug)}
                  />
                  <span className="flex-1 text-sm">{brand.name}</span>
                  <span className="text-xs text-gray-500">({brand.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="rounded-lg border bg-white">
          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="flex w-full items-center justify-between p-4 font-semibold"
          >
            Price Range
            {priceOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {priceOpen && (
            <div className="border-t p-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="₹0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="₹200,000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              {/* Quick Filters */}
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-semibold text-gray-600">
                  Quick Filters:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPrice("0");
                      setMaxPrice("30000");
                    }}
                    className="text-xs"
                  >
                    Under ₹30k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPrice("30000");
                      setMaxPrice("60000");
                    }}
                    className="text-xs"
                  >
                    ₹30k - ₹60k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPrice("60000");
                      setMaxPrice("100000");
                    }}
                    className="text-xs"
                  >
                    ₹60k - ₹1L
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPrice("100000");
                      setMaxPrice("");
                    }}
                    className="text-xs"
                  >
                    Above ₹1L
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* APPLY BUTTON */}
      <div className="sticky bottom-0 bg-white pt-4 border-t">
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
