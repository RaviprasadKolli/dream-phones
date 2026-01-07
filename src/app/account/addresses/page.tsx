"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AddressForm } from "@/components/checkout/address-form";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/layout/cart-button";
import {
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Loader2,
  Home,
  Briefcase,
  MapPinned,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  type: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/account/addresses");
    } else if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/addresses");
      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success! 🎉",
        description: "Address deleted successfully",
      });

      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "HOME":
        return <Home className="h-5 w-5" />;
      case "WORK":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <MapPinned className="h-5 w-5" />;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
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
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Products
              </Link>
              <CartButton />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Addresses</h1>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <AddressForm
                address={editingAddress || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <div className="rounded-lg border bg-white p-12 text-center">
              <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                No addresses yet
              </h2>
              <p className="mb-6 text-gray-600">
                Add your first address to get started
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`relative rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                    address.isDefault
                      ? "border-purple-500 ring-2 ring-purple-100"
                      : ""
                  }`}
                >
                  {/* Default Badge */}
                  {address.isDefault && (
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        Default
                      </span>
                    </div>
                  )}

                  {/* Address Type Icon */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                      {getIcon(address.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {address.type}
                      </h3>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="mb-4 text-sm text-gray-600">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="flex-1"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
