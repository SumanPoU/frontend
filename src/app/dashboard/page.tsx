"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getInvoicesAction, type Invoice } from "@/actions/invoice-acions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvoiceTable } from "@/components/dashboard/invoice-table";
import { InvoiceDetailsDialog } from "@/components/dashboard/invoice-details-dialog";
import { CreateInvoiceDialog } from "@/components/dashboard/create-invoice-dialog";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const router = useRouter();

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getInvoicesAction();

      if (!result.success) {
        setError(result.message || "Failed to fetch invoices");
        if (result.shouldRedirect) {
          router.push("/login");
        }
        return;
      }

      setInvoices(result.data || []);
    } catch (err: any) {
      console.error("Error fetching invoices:", err);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 md:px-0">
      <Card className="border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 ">
                Invoices
              </h2>
              <p className="hidden md:inline-block text-muted-foreground">
                Manage and view your invoices
              </p>
            </div>
            <CreateInvoiceDialog onInvoiceCreated={fetchInvoices} />
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No invoices found</p>
              <Button onClick={fetchInvoices}>Retry</Button>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      <InvoiceDetailsDialog
        invoice={selectedInvoice}
        open={isDetailsDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInvoice(null);
            setIsDetailsDialogOpen(false);
          }
        }}
      />
    </div>
  );
}
