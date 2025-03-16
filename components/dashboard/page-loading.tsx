"use client";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useTheme } from "@/lib/store/theme";
import { ContentType } from "@prisma/client";
import { useEffect } from "react";

export function PageLoading({ page }: { page: Partial<ContentType> }) {
  const { setPage, setPageId } = useDashboardStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    setPage(page);
    setPageId(page?.id || "");
    setTheme({ theme: page.style, alignment: page.alignment, primaryColor: page.primaryColor });
  }, [page, setPage]);

  return null;
}
