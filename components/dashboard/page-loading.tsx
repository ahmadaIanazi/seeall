"use client";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useEffect } from "react";

export function PageLoading({ pageId }: { pageId: string }) {
  const { setPage } = useDashboardStore();

  useEffect(() => {
    async function fetchHeader() {
      try {
        const res = await fetch(`/api/page/${pageId}`);
        if (!res.ok) throw new Error("Failed to fetch page header");
        const data = await res.json();
        console.log("~FETCHED PAGE:", data);
        setPage(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchHeader();
  }, [pageId, setPage]);

  return null;
}
