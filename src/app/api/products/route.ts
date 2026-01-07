import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      const categories = category.split(",").filter(Boolean);
      if (categories.length > 0) {
        where.category = {
          slug: {
            in: categories,
          },
        };
      }
    }

    if (brand) {
      const brands = brand.split(",").filter(Boolean);
      if (brands.length > 0) {
        where.brand = {
          slug: {
            in: brands,
          },
        };
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products and total count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Get ALL categories and brands with their product counts
    const [allCategories, allBrands] = await Promise.all([
      prisma.category.findMany({
        select: {
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.findMany({
        select: {
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    // Count products for each category
    const categoriesWithCount = await Promise.all(
      allCategories.map(async (cat) => {
        const count = await prisma.product.count({
          where: {
            categoryId: (
              await prisma.category.findUnique({ where: { slug: cat.slug } })
            )?.id,
            isActive: true,
          },
        });
        return {
          name: cat.name,
          slug: cat.slug,
          count,
        };
      })
    );

    // Count products for each brand
    const brandsWithCount = await Promise.all(
      allBrands.map(async (brand) => {
        const count = await prisma.product.count({
          where: {
            brandId: (
              await prisma.brand.findUnique({ where: { slug: brand.slug } })
            )?.id,
            isActive: true,
          },
        });
        return {
          name: brand.name,
          slug: brand.slug,
          count,
        };
      })
    );

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    console.log("📊 Filter data:", {
      categories: categoriesWithCount,
      brands: brandsWithCount,
    });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
      filters: {
        categories: categoriesWithCount.filter((c) => c.count > 0),
        brands: brandsWithCount.filter((b) => b.count > 0),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
