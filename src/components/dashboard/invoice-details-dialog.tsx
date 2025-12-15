"use client";

import type { Invoice } from "@/actions/invoice-acions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "default";
      case "Unpaid":
        return "secondary";
      case "Overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            {invoice.invoiceNumber} • {invoice.customer}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] px-6">
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invoice Number
                </p>
                <p className="font-semibold">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer
                </p>
                <p>{invoice.customer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invoice Date
                </p>
                <p>{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Due Date
                </p>
                <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Amount
                </p>
                <p className="text-xl font-bold">
                  ${invoice.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={getStatusColor(invoice.status)}
                  className="w-fit"
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>

            {invoice.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p>{invoice.description}</p>
              </div>
            )}

            <Separator />

            <div>
              <p className="text-sm font-medium mb-3">Items</p>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {invoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.item}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${(item.qty * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total Amount</p>
              <p className="text-2xl font-bold">${invoice.amount.toFixed(2)}</p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
