import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    console.log("🔍 Looking for product with slug:", slug);

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    console.log("📦 Product found:", product ? product.name : "NOT FOUND");

    if (!product) {
      // Log all available slugs for debugging
      const allProducts = await prisma.product.findMany({
        select: { slug: true, name: true },
        take: 5,
      });
      console.log(
        "❌ Product not found. Available slugs:",
        allProducts.map((p) => p.slug)
      );

      return NextResponse.json(
        {
          error: "Product not found",
          availableSlugs: allProducts.map((p) => p.slug),
        },
        { status: 404 }
      );
    }

    // Get related products (same category, different product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: product.id,
        },
        isActive: true,
      },
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
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
