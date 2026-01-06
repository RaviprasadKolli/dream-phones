const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing products, categories, and brands...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  // Create Categories
  console.log("📁 Creating categories...");
  const smartphones = await prisma.category.create({
    data: {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest smartphones from top brands",
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Phone accessories and gadgets",
    },
  });

  const tablets = await prisma.category.create({
    data: {
      name: "Tablets",
      slug: "tablets",
      description: "Tablets and iPads",
    },
  });

  // Create Brands
  console.log("🏷️  Creating brands...");
  const apple = await prisma.brand.create({
    data: {
      name: "Apple",
      slug: "apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
  });

  const samsung = await prisma.brand.create({
    data: {
      name: "Samsung",
      slug: "samsung",
    },
  });

  const oneplus = await prisma.brand.create({
    data: {
      name: "OnePlus",
      slug: "oneplus",
    },
  });

  const google = await prisma.brand.create({
    data: {
      name: "Google",
      slug: "google",
    },
  });

  const xiaomi = await prisma.brand.create({
    data: {
      name: "Xiaomi",
      slug: "xiaomi",
    },
  });

  const anker = await prisma.brand.create({
    data: {
      name: "Anker",
      slug: "anker",
    },
  });

  const spigen = await prisma.brand.create({
    data: {
      name: "Spigen",
      slug: "spigen",
    },
  });

  const generic = await prisma.brand.create({
    data: {
      name: "Generic",
      slug: "generic",
    },
  });

  // Create Products - Smartphones
  console.log("📱 Creating smartphones...");

  await prisma.product.create({
    data: {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      sku: "IPH-15-PRO-MAX-001",
      description:
        "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.",
      price: 159900,
      compareAtPrice: 169900,
      quantity: 25,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: apple.id } },
      images: [
        "https://images.unsplash.com/photo-1696446702338-recipient699d52f4?w=800",
      ],
      specifications: {
        display: '6.7" Super Retina XDR',
        processor: "A17 Pro chip",
        camera: "48MP",
        battery: "4422 mAh",
        storage: "256GB",
      },
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: "iPhone 15",
      slug: "iphone-15",
      sku: "IPH-15-002",
      description: "iPhone 15 brings you Dynamic Island and powerful camera.",
      price: 79900,
      quantity: 40,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: apple.id } },
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
      ],
      specifications: {
        display: '6.1" Super Retina XDR',
        processor: "A16 Bionic",
        storage: "128GB",
      },
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      sku: "SAM-S24-ULTRA-003",
      description: "Most powerful Galaxy with S Pen and 200MP camera.",
      price: 129999,
      quantity: 30,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: samsung.id } },
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      ],
      specifications: {
        display: '6.8" Dynamic AMOLED',
        processor: "Snapdragon 8 Gen 3",
        camera: "200MP",
        storage: "256GB",
      },
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy S23",
      slug: "samsung-galaxy-s23",
      sku: "SAM-S23-004",
      description: "Powerful performance meets stunning design.",
      price: 74999,
      quantity: 35,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: samsung.id } },
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      ],
      specifications: {
        display: '6.1" Dynamic AMOLED',
        processor: "Snapdragon 8 Gen 2",
        storage: "128GB",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "OnePlus 12",
      slug: "oneplus-12",
      sku: "ONE-12-005",
      description: "Fast and smooth with 120Hz display.",
      price: 64999,
      quantity: 20,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: oneplus.id } },
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      ],
      specifications: {
        display: '6.82" AMOLED',
        processor: "Snapdragon 8 Gen 3",
        storage: "256GB",
      },
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: "OnePlus Nord CE 3",
      slug: "oneplus-nord-ce-3",
      sku: "ONE-NORD-CE3-006",
      description: "Affordable performance with 5G.",
      price: 26999,
      quantity: 45,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: oneplus.id } },
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      ],
      specifications: {
        display: '6.7" AMOLED',
        processor: "Snapdragon 782G",
        storage: "128GB",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Google Pixel 8 Pro",
      slug: "google-pixel-8-pro",
      sku: "GOO-PIX-8-PRO-007",
      description: "AI-powered camera and pure Google experience.",
      price: 106999,
      quantity: 18,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: google.id } },
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      ],
      specifications: {
        display: '6.7" LTPO OLED',
        processor: "Google Tensor G3",
        storage: "256GB",
      },
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: "Google Pixel 8",
      slug: "google-pixel-8",
      sku: "GOO-PIX-8-008",
      description: "Compact powerhouse with best Android.",
      price: 75999,
      quantity: 22,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: google.id } },
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
      ],
      specifications: {
        display: '6.2" OLED',
        processor: "Google Tensor G3",
        storage: "128GB",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Xiaomi 13 Pro",
      slug: "xiaomi-13-pro",
      sku: "XIA-13-PRO-009",
      description: "Professional Leica camera system.",
      price: 79999,
      quantity: 15,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: xiaomi.id } },
      images: [
        "https://images.unsplash.com/photo-1592286927505-43c51b0ec6eb?w=800",
      ],
      specifications: {
        display: '6.73" AMOLED',
        processor: "Snapdragon 8 Gen 2",
        camera: "50MP Leica",
        storage: "256GB",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Xiaomi Redmi Note 13 Pro",
      slug: "xiaomi-redmi-note-13-pro",
      sku: "XIA-REDMI-N13-010",
      description: "Best budget phone with 200MP camera.",
      price: 23999,
      quantity: 50,
      category: { connect: { id: smartphones.id } },
      brand: { connect: { id: xiaomi.id } },
      images: [
        "https://images.unsplash.com/photo-1592286927505-43c51b0ec6eb?w=800",
      ],
      specifications: {
        display: '6.67" AMOLED',
        processor: "Snapdragon 7s Gen 2",
        camera: "200MP",
        storage: "128GB",
      },
    },
  });

  // Accessories
  console.log("🎧 Creating accessories...");

  await prisma.product.create({
    data: {
      name: "AirPods Pro (2nd gen)",
      slug: "airpods-pro-2",
      sku: "APP-AIRPODS-PRO-2-011",
      description: "Active Noise Cancellation and Spatial Audio.",
      price: 26900,
      quantity: 60,
      category: { connect: { id: accessories.id } },
      brand: { connect: { id: apple.id } },
      images: [
        "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
      ],
      specifications: {
        type: "True Wireless Earbuds",
        battery: "Up to 6 hours",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy Buds2 Pro",
      slug: "galaxy-buds2-pro",
      sku: "SAM-BUDS2-PRO-012",
      description: "Premium sound with ANC.",
      price: 17999,
      quantity: 40,
      category: { connect: { id: accessories.id } },
      brand: { connect: { id: samsung.id } },
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      ],
      specifications: {
        type: "True Wireless",
        battery: "Up to 5 hours",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Anker 20000mAh Power Bank",
      slug: "anker-powerbank-20000",
      sku: "ANK-PWR-20K-013",
      description: "High-capacity fast charging.",
      price: 2999,
      quantity: 100,
      category: { connect: { id: accessories.id } },
      brand: { connect: { id: anker.id } },
      images: [
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
      ],
      specifications: {
        capacity: "20000mAh",
        output: "USB-C PD 20W",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Spigen Rugged Case",
      slug: "spigen-rugged-armor",
      sku: "SPI-CASE-RUG-014",
      description: "Military-grade protection.",
      price: 1499,
      quantity: 150,
      category: { connect: { id: accessories.id } },
      brand: { connect: { id: spigen.id } },
      images: [
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
      ],
      specifications: {
        material: "TPU Carbon Fiber",
        protection: "Drop Protection",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "65W GaN Charger",
      slug: "65w-gan-charger",
      sku: "GAN-CHG-65W-015",
      description: "Ultra-compact fast charger.",
      price: 2499,
      quantity: 80,
      category: { connect: { id: accessories.id } },
      brand: { connect: { id: generic.id } },
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
      ],
      specifications: {
        power: "65W",
        ports: "2x USB-C + 1x USB-A",
      },
    },
  });

  // Tablets
  console.log("💻 Creating tablets...");

  await prisma.product.create({
    data: {
      name: 'iPad Pro 12.9"',
      slug: "ipad-pro-12-9",
      sku: "APP-IPAD-PRO-12-016",
      description: "Ultimate iPad with M2 chip.",
      price: 112900,
      quantity: 12,
      category: { connect: { id: tablets.id } },
      brand: { connect: { id: apple.id } },
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
      ],
      specifications: {
        display: '12.9" Liquid Retina XDR',
        processor: "Apple M2",
        storage: "256GB",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "iPad Air",
      slug: "ipad-air",
      sku: "APP-IPAD-AIR-017",
      description: "Powerful and versatile.",
      price: 59900,
      quantity: 20,
      category: { connect: { id: tablets.id } },
      brand: { connect: { id: apple.id } },
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
      ],
      specifications: {
        display: '10.9" Liquid Retina',
        processor: "Apple M1",
        storage: "64GB",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy Tab S9",
      slug: "galaxy-tab-s9",
      sku: "SAM-TAB-S9-018",
      description: "Premium tablet with S Pen.",
      price: 76999,
      quantity: 15,
      category: { connect: { id: tablets.id } },
      brand: { connect: { id: samsung.id } },
      images: [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
      ],
      specifications: {
        display: '11" Dynamic AMOLED',
        processor: "Snapdragon 8 Gen 2",
        storage: "128GB",
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`   - ${await prisma.category.count()} categories`);
  console.log(`   - ${await prisma.brand.count()} brands`);
  console.log(`   - ${await prisma.product.count()} products`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
