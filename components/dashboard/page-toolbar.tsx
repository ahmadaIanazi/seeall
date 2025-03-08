"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDashboardStore } from "@/lib/store/dashboard";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight, Palette, Paintbrush, LayoutTemplate, ChevronDown, ChevronRight, Edit, Save, Loader2, Eye } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { THEMES } from "@/types/content-type";

interface PageToolbarProps {
  pageId: string | null;
}

export function PageToolbar({ pageId }: PageToolbarProps) {
  const { page, setPage, setPageId } = useDashboardStore();
  const [isSaving, setIsSaving] = useState(false);
  const { edit, setEdit, hasUnsavedChanges, saveChanges } = useDashboardStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveChanges();
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

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

  // Check if scroll is needed
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollIndicator(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    // Additional check after the transition completes
    if (edit) {
      const timer = setTimeout(checkScroll, 350);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkScroll);
      };
    }

    return () => window.removeEventListener("resize", checkScroll);
  }, [edit]);

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
    { value: THEMES.DEFAULT, label: THEMES.DEFAULT.charAt(0) + THEMES.DEFAULT.slice(1).toLowerCase() },
    { value: THEMES.MODERN, label: THEMES.MODERN.charAt(0) + THEMES.MODERN.slice(1).toLowerCase() },
    { value: THEMES.RETRO, label: THEMES.RETRO.charAt(0) + THEMES.RETRO.slice(1).toLowerCase() },
    { value: THEMES.ELEGANT, label: THEMES.ELEGANT.charAt(0) + THEMES.ELEGANT.slice(1).toLowerCase() },
    { value: THEMES.CLASSIC, label: THEMES.CLASSIC.charAt(0) + THEMES.CLASSIC.slice(1).toLowerCase() },
    { value: THEMES.PLAYFUL, label: THEMES.PLAYFUL.charAt(0) + THEMES.PLAYFUL.slice(1).toLowerCase() },
    { value: THEMES.MINIMAL, label: THEMES.MINIMAL.charAt(0) + THEMES.MINIMAL.slice(1).toLowerCase() },
    { value: THEMES.BRUTALIST, label: THEMES.BRUTALIST.charAt(0) + THEMES.BRUTALIST.slice(1).toLowerCase() },
    { value: THEMES.FUTURISTIC, label: THEMES.FUTURISTIC.charAt(0) + THEMES.FUTURISTIC.slice(1).toLowerCase() },
  ];

  // Get display name for the current theme
  const getCurrentThemeName = () => {
    return themeOptions.find((option) => option.value === theme)?.label || "DEFAULT";
  };

  return (
    <div
      className={cn(
        "sticky top-1 z-10 my-2 transition-all duration-300 ease-in-out w-auto rounded-full shadow-md backdrop-blur-md supports-[backdrop-filter]:bg-muted/60",
        edit ? "mx-2 " : "mx-auto max-w-fit"
      )}
    >
      {/* Toggle buttons */}
      <div className={cn("flex items-center", edit ? "justify-between" : "justify-center")}>
        {edit && (
          <div className='flex-grow flex items-center overflow-hidden px-2'>
            <Button onClick={handleSave} disabled={!hasUnsavedChanges || isSaving} size='sm' className='rounded-full transition-all duration-300'>
              {isSaving && <Loader2 className='h-4 w-4 animate-spin' />}
              <Save className='h-4 w-4' />
              Save
            </Button>
            <div ref={scrollContainerRef} className='flex items-center gap-2 py-2 px-3 overflow-x-auto no-scrollbar'>
              <div className='flex items-center gap-1 border-r pr-3 min-w-fit'>
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

              <div className='flex items-center gap-1 border-r pr-3 min-w-fit'>
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

              <div className='flex items-center gap-1 border-r pr-3 min-w-fit'>
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

              <div className='flex items-center gap-1 min-w-fit'>
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

            {/* Scroll indicator gradient and arrow */}
            {showScrollIndicator && (
              <div className='absolute right-24 top-0 bottom-0 flex items-center pointer-events-none'>
                <div className='w-12 h-full bg-gradient-to-l from-muted/60 to-transparent' />
                <ChevronRight className='h-4 w-4 text-muted-foreground animate-pulse -ml-6' />
              </div>
            )}
          </div>
        )}

        {/* Toggle buttons */}
        <div className={cn("flex items-center py-2", edit ? "px-3" : "px-3")}>
          {edit ? (
            <>
              <Button onClick={() => setEdit(false)} variant='outline' size='sm' className='rounded-full transition-all duration-300'>
                <Eye className='h-4 w-4' />
                Preview
              </Button>
            </>
          ) : (
            <Button onClick={() => setEdit(true)} size='sm' className='gap-2 rounded-full transition-all duration-300'>
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
