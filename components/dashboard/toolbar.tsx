"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDashboardStore } from "@/lib/store/dashboard";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useEffect, useState } from "react";

interface PageToolbarProps {
  pageId: string | null;
}

export function PageToolbar({ pageId }: PageToolbarProps) {
  const { page, setPage, setPageId } = useDashboardStore();
  const [alignment, setAlignment] = useState("center");

  useEffect(() => {
    // setPage(page);
    setPageId(pageId || "");
  }, [page]);

  function handleAlignmentChange(value: string | null): void {
    if (!value) return;
    // setPage({ alignment: value });
  }

  // if (!page) return null;

  return (
    <div
      className={cn(
        "sticky top-1 z-10 mx-2 my-2 px-3 rounded-full",
        "flex items-center justify-between gap-4 backdrop-blur-md supports-[backdrop-filter]:bg-muted/60",
        "shadow-md"
      )}
    >
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-muted-foreground'>Align</span>
        <ToggleGroup type='single' value={alignment} onValueChange={handleAlignmentChange} className='flex gap-1'>
          <ToggleGroupItem value='left' aria-label='Left align'>
            <AlignLeft className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem value='center' aria-label='Center align'>
            <AlignCenter className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem value='right' aria-label='Right align'>
            <AlignRight className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
