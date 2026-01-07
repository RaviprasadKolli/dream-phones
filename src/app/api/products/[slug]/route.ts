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
      where.category = {
        slug: category,
      };
    }

    if (brand) {
      where.brand = {
        slug: brand,
      };
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

    // Fetch products and total count in parallel
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

    // Get filter data (categories and brands with counts)
    const [categoriesWithCount, brandsWithCount] = await Promise.all([
      prisma.category.findMany({
        where: {
          products: {
            some: {
              isActive: true,
            },
          },
        },
        select: {
          name: true,
          slug: true,
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.brand.findMany({
        where: {
          products: {
            some: {
              isActive: true,
            },
          },
        },
        select: {
          name: true,
          slug: true,
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    // Format filter data
    const categories = categoriesWithCount.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      count: cat._count.products,
    }));

    const brands = brandsWithCount.map((brand) => ({
      name: brand.name,
      slug: brand.slug,
      count: brand._count.products,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

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
        categories,
        brands,
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
