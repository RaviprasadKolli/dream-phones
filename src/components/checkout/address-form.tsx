"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AddressFormProps {
  address?: {
    id?: string;
    type: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddressForm({
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: address?.type || "HOME",
    line1: address?.line1 || "",
    line2: address?.line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    country: address?.country || "India",
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = address?.id ? "PUT" : "POST";
      const url = address?.id
        ? `/api/addresses/${address.id}`
        : "/api/addresses";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save address");

      toast({
        title: "Success! 🎉",
        description: `Address ${
          address?.id ? "updated" : "added"
        } successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Address Type */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Address Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="HOME">Home</option>
          <option value="WORK">Work</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <Input
          name="line1"
          value={formData.line1}
          onChange={handleChange}
          placeholder="House/Flat No., Building Name"
          required
        />
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Address Line 2
        </label>
        <Input
          name="line2"
          value={formData.line2}
          onChange={handleChange}
          placeholder="Street, Area, Landmark (Optional)"
        />
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
        </div>
      </div>

      {/* Postal Code & Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <Input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="110001"
            required
            maxLength={6}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Country
          </label>
          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* Set as Default */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label className="text-sm text-gray-700">Set as default address</label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading
            ? "Saving..."
            : address?.id
            ? "Update Address"
            : "Add Address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
