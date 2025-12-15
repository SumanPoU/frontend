"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [invoice, setInvoice] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");
    } catch (err: any) {
      console.error("something went");
    } finally {
      setIsLoading(false);
    }
  };

  return <div>Dashboard</div>;
}
