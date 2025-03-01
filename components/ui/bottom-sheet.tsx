"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ children, open, onOpenChange, title }: BottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='bottom'
        className={cn(
          "h-[85vh]",
          // Remove default padding when no header
          !title && "p-0"
        )}
      >
        {title ? (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {children}
          </SheetHeader>
        ) : (
          children
        )}
      </SheetContent>
    </Sheet>
  );
}
