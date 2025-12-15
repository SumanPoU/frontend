"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type React from "react";
import type { InvoiceItem } from "@/actions/invoice-acions";
import { createInvoiceAction } from "@/actions/invoice-acions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface CreateInvoiceDialogProps {
  onInvoiceCreated: () => void;
  trigger?: React.ReactNode;
}

export function CreateInvoiceDialog({
  onInvoiceCreated,
  trigger,
}: CreateInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    dueDate: "",
    description: "",
    items: [{ item: "", qty: 1, price: 0 }] as InvoiceItem[],
  });

  const resetForm = () => {
    setFormData({
      customer: "",
      date: "",
      dueDate: "",
      description: "",
      items: [{ item: "", qty: 1, price: 0 }],
    });
    setFormError(null);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item: "", qty: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.customer || !formData.date || !formData.dueDate) {
      setFormError("Customer, date, and due date are required");
      return;
    }

    if (new Date(formData.dueDate) < new Date(formData.date)) {
      setFormError("Due date cannot be earlier than invoice date");
      return;
    }

    if (formData.items.length === 0) {
      setFormError("At least one item is required");
      return;
    }

    for (const item of formData.items) {
      if (!item.item || item.qty <= 0 || item.price <= 0) {
        setFormError("All items must have a name, quantity > 0, and price > 0");
        return;
      }
    }

    setIsCreating(true);

    try {
      const result = await createInvoiceAction(formData);

      if (!result.success) {
        setFormError(result.message || "Failed to create invoice");
        if (result.shouldRedirect) {
          router.push("/login");
        }
        return;
      }

      // Success - close dialog and refresh
      setOpen(false);
      resetForm();
      onInvoiceCreated();
    } catch (err: any) {
      setFormError("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="size-4" />
            Add Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new invoice
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateInvoice}>
          <div className="grid gap-4 py-4">
            {formError && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer *</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Invoice Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Invoice description (optional)"
                rows={3}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label>Items *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <Plus className="size-4" />
                  Add Item
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_100px_120px_40px] gap-2 items-end"
                >
                  <div className="grid gap-2">
                    <Label htmlFor={`item-${index}`}>Item Name</Label>
                    <Input
                      id={`item-${index}`}
                      value={item.item}
                      onChange={(e) =>
                        handleItemChange(index, "item", e.target.value)
                      }
                      placeholder="Item name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`qty-${index}`}>Qty</Label>
                    <Input
                      id={`qty-${index}`}
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "qty",
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      required
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="mb-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex justify-end items-center gap-2 pt-2 border-t">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-bold">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
