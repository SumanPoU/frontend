"use server";

import { cookies } from "next/headers";

export interface InvoiceItem {
  item: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  description: string;
  items: InvoiceItem[];
}

export interface InvoicesResponse {
  message: string;
  user: {
    id: number;
    username: string;
    iat: number;
    exp: number;
  };
  invoices: Invoice[];
}

export async function getInvoicesAction() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found",
        shouldRedirect: true,
      };
    }

    const response = await fetch(`${process.env.API_BASE_URL}/invoices`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message: "Token invalid or expired",
          shouldRedirect: true,
        };
      }
      throw new Error(`Failed to fetch invoices: ${response.status}`);
    }

    const data: InvoicesResponse = await response.json();

    return {
      success: true,
      data: data.invoices,
      user: data.user,
    };
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch invoices",
    };
  }
}

export async function createInvoiceAction(invoiceData: {
  customer: string;
  date: string;
  dueDate: string;
  description?: string;
  items: InvoiceItem[];
}) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found",
        shouldRedirect: true,
      };
    }

    const response = await fetch(`${process.env.API_BASE_URL}/invoices`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message: "Token invalid or expired",
          shouldRedirect: true,
        };
      }
      if (response.status === 400) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Validation error",
        };
      }
      throw new Error(`Failed to create invoice: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.invoice,
      message: data.message,
    };
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      message: error.message || "Failed to create invoice",
    };
  }
}
