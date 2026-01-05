import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Wrench, Shield, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Dream Phones</span>
          </Link>

          <nav className="hidden gap-6 md:flex">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-24 text-center md:py-32">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">Dream Phones</span>
          </h1>
          <p className="mx-auto max-w-175 text-lg text-muted-foreground md:text-xl">
            Your trusted destination for the latest smartphones, tablets, and
            accessories. Buy with confidence and get expert repair services.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/products">
            <Button size="lg" className="gap-2">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose Us?
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Wide Selection</h3>
              <p className="text-muted-foreground">
                Browse from hundreds of latest smartphones and accessories
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Genuine Products</h3>
              <p className="text-muted-foreground">
                100% authentic products with manufacturer warranty
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Repairs</h3>
              <p className="text-muted-foreground">
                Professional repair services for all brands
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and secure delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-lg bg-primary px-8 py-16 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg">
            Create an account today and explore our amazing collection
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold">Dream Phones</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted mobile shop in Hyderabad
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className="hover:text-primary">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-primary">
                    Smartphones
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-primary">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Dream Phones. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
