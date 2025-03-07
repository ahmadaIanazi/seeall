"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDashboardStore } from "@/lib/store/dashboard";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight, Palette, Paintbrush, LayoutTemplate, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PageToolbarProps {
  pageId: string | null;
}

export function PageToolbar({ pageId }: PageToolbarProps) {
  const { page, setPage, setPageId } = useDashboardStore();

  // Initialize states from the page data
  const [alignment, setAlignment] = useState(page?.alignment || "center");
  const [backgroundColor, setBackgroundColor] = useState(page?.backgroundColor || "#ffffff");
  const [primaryColor, setPrimaryColor] = useState(page?.brandColor || "#000000");
  const [theme, setTheme] = useState(page?.style || "rounded");

  useEffect(() => {
    setPageId(pageId || "");

    // Set initial values when page changes
    if (page) {
      setAlignment(page.alignment || "center");
      setBackgroundColor(page.backgroundColor || "#ffffff");
      setPrimaryColor(page.brandColor || "#000000");
      setTheme(page.style || "rounded");
    }
  }, [page, pageId, setPageId]);

  function handleAlignmentChange(value: string | null): void {
    if (!value) return;
    setAlignment(value);
    setPage({ alignment: value });
  }

  function handleBackgroundColorChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setBackgroundColor(value);
    setPage({ backgroundColor: value });
  }

  function handlePrimaryColorChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setPrimaryColor(value);
    setPage({ brandColor: value });
  }

  function handleThemeChange(value: string | null): void {
    if (!value) return;
    setTheme(value);
    setPage({ style: value });
  }

  // Theme options for the toggle group
  const themeOptions = [
    { value: "rounded", label: "Rounded" },
    { value: "squared", label: "Squared" },
    { value: "circle", label: "Circle" },
    { value: "retro", label: "Retro" },
    { value: "elegant", label: "Elegant" },
    { value: "classic", label: "Classic" },
  ];

  // Get display name for the current theme
  const getCurrentThemeName = () => {
    return themeOptions.find((option) => option.value === theme)?.label || "Theme";
  };

  return (
    <div
      className={cn(
        "sticky top-1 z-10 mx-2 my-2 px-3 rounded-full",
        "flex items-center justify-between gap-4 backdrop-blur-md supports-[backdrop-filter]:bg-muted/60",
        "shadow-md"
      )}
    >
      <div className='flex items-center gap-2 py-2'>
        <div className='flex items-center gap-1 border-r pr-3'>
          <span className='text-sm font-medium'>Align</span>
          <ToggleGroup type='single' value={alignment} onValueChange={handleAlignmentChange} className='flex'>
            <ToggleGroupItem value='left' aria-label='Align left' className='h-8 w-8 p-0'>
              <AlignLeft className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='center' aria-label='Align center' className='h-8 w-8 p-0'>
              <AlignCenter className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='right' aria-label='Align right' className='h-8 w-8 p-0'>
              <AlignRight className='h-4 w-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className='flex items-center gap-1 border-r pr-3'>
          <Popover>
            <PopoverTrigger className='flex items-center gap-1 hover:bg-muted px-2 py-1 rounded-md'>
              <Palette className='h-4 w-4' />
              <span className='text-sm'>Background</span>
              <div className='h-4 w-4 rounded-full border' style={{ backgroundColor }} />
              <ChevronDown className='h-3 w-3' />
            </PopoverTrigger>
            <PopoverContent className='w-auto p-2'>
              <div className='flex items-center gap-2'>
                <input type='color' value={backgroundColor} onChange={handleBackgroundColorChange} className='h-8 w-12 cursor-pointer border rounded' />
                <span className='text-xs'>{backgroundColor}</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex items-center gap-1 border-r pr-3'>
          <Popover>
            <PopoverTrigger className='flex items-center gap-1 hover:bg-muted px-2 py-1 rounded-md'>
              <Paintbrush className='h-4 w-4' />
              <span className='text-sm'>Primary</span>
              <div className='h-4 w-4 rounded-full border' style={{ backgroundColor: primaryColor }} />
              <ChevronDown className='h-3 w-3' />
            </PopoverTrigger>
            <PopoverContent className='w-auto p-2'>
              <div className='flex items-center gap-2'>
                <input type='color' value={primaryColor} onChange={handlePrimaryColorChange} className='h-8 w-12 cursor-pointer border rounded' />
                <span className='text-xs'>{primaryColor}</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex items-center gap-1'>
          <Popover>
            <PopoverTrigger className='flex items-center gap-1 hover:bg-muted px-2 py-1 rounded-md'>
              <LayoutTemplate className='h-4 w-4' />
              <span className='text-sm'>{getCurrentThemeName()}</span>
              <ChevronDown className='h-3 w-3' />
            </PopoverTrigger>
            <PopoverContent className='w-auto p-2'>
              <ToggleGroup type='single' value={theme} onValueChange={handleThemeChange} className='flex flex-col gap-1'>
                {themeOptions.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value} className='justify-start text-sm w-full'>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
