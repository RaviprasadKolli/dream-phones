import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    console.log("🔍 Fetching product with slug:", slug);

    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
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
      console.log("❌ Product not found for slug:", slug);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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

    console.log("✅ Returning product:", product.name);

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
