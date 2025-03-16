// import { THEMES, Alignment, ContentType } from "@/types";
import { cn } from "@/lib/utils";
import { ContentType, THEMES, Alignment } from "@/types";

// Helper function to get CSS variable style for primary color
export function getPrimaryColorStyle(primaryColor?: string) {
  if (!primaryColor) return {};

  return {
    "--primary-color": primaryColor,
    "--primary-hover": adjustColorBrightness(primaryColor, -10),
  };
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (r * percent) / 100));
  g = Math.max(0, Math.min(255, g + (g * percent) / 100));
  b = Math.max(0, Math.min(255, b + (b * percent) / 100));

  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

// Main function to get theme classes
export function getThemeClasses(componentType: string, elementType: string, theme: THEMES = THEMES.DEFAULT, alignment: Alignment = "left") {
  // Base classes that are common across themes
  const baseClasses = getBaseClasses(componentType, elementType, alignment);

  // Theme-specific classes
  const themeClasses = getThemeSpecificClasses(componentType, elementType, theme);

  // Combine and return classes
  return cn(baseClasses, themeClasses);
}

// Function to get base classes based on component and element type
function getBaseClasses(componentType: string, elementType: string, alignment: Alignment) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Common base classes for each element type
  const commonBaseClasses: Record<string, Record<string, string>> = {
    container: {
      default: "w-full",
      [ContentType.LINK]: "block w-full",
      [ContentType.IMAGE]: "overflow-hidden",
      [ContentType.CATEGORY]: "w-full",
      [ContentType.PRODUCT]: "overflow-hidden",
      [ContentType.SOCIAL]: "w-full",
      [ContentType.PAGE_TITLE]: "mb-8",
      [ContentType.PAGE_AVATAR]: "mb-6 flex flex-col items-center justify-center",
      [ContentType.PAGE_BIO]: "mb-8",
      [ContentType.SOCIAL_LINKS]: "mb-6",
      [ContentType.CATEGORIES_LIST]: "mb-8",
    },
    card: {
      default: "w-full",
      [ContentType.LINK]: "overflow-hidden transition-all hover:shadow-md",
      [ContentType.IMAGE]: "overflow-hidden",
      [ContentType.CATEGORY]: "w-full",
      [ContentType.PRODUCT]: "overflow-hidden",
      [ContentType.SOCIAL]: "w-full",
      [ContentType.PAGE_BIO]: "w-full",
      [ContentType.SOCIAL_LINKS]: "w-full",
    },
    cardContent: {
      default: "p-4",
      [ContentType.LINK]: "flex items-center justify-between p-4",
      [ContentType.IMAGE]: "p-4",
      [ContentType.PRODUCT]: "pb-2 pt-0",
    },
    cardHeader: {
      default: "pb-2",
      [ContentType.PRODUCT]: "pb-2 pt-3",
    },
    title: {
      default: "font-medium",
      [ContentType.CATEGORY]: "text-xl font-bold",
      [ContentType.PRODUCT]: "text-lg",
      [ContentType.PAGE_TITLE]: "text-4xl font-bold tracking-tight md:text-5xl",
      [ContentType.PAGE_AVATAR]: "mt-4 text-2xl font-bold",
    },
    description: {
      default: "text-sm text-muted-foreground",
      [ContentType.CATEGORY]: "text-base",
      [ContentType.PAGE_TITLE]: "mt-2 text-lg text-muted-foreground",
    },
    image: {
      default: "w-full",
      [ContentType.IMAGE]: "h-full w-full object-cover transition-transform hover:scale-105",
      [ContentType.PRODUCT]: "h-full w-full object-cover",
      [ContentType.PAGE_AVATAR]: "h-full w-full rounded-full object-cover",
      [ContentType.SOCIAL]: "h-full w-full object-cover",
    },
    imageContainer: {
      default: "overflow-hidden",
      [ContentType.IMAGE]: "relative h-48 w-full overflow-hidden",
      [ContentType.PRODUCT]: "relative h-48 w-full overflow-hidden bg-muted",
      [ContentType.PAGE_AVATAR]: "h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 p-1",
      [ContentType.SOCIAL]: "h-12 w-12 overflow-hidden rounded-full",
    },
    iconContainer: {
      default: "flex items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.LINK]: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.IMAGE]: "flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.CATEGORY]: "flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.PRODUCT]: "flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.SOCIAL]: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.PAGE_TITLE]: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.PAGE_AVATAR]: "flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.PAGE_BIO]: "flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary",
      [ContentType.SOCIAL_LINKS]:
        "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground",
    },
    icon: {
      default: "h-4 w-4",
      [ContentType.CATEGORY]: "h-5 w-5",
      [ContentType.SOCIAL]: "h-6 w-6",
      [ContentType.PAGE_TITLE]: "h-8 w-8",
      [ContentType.PAGE_AVATAR]: "h-16 w-16",
      [ContentType.SOCIAL_LINKS]: "h-6 w-6",
    },
    button: {
      default:
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    },
    badge: {
      default: "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      primary: "bg-primary text-primary-foreground",
      outline: "border border-input bg-background text-foreground shadow-sm",
    },
    categoryItem: {
      default: "flex min-w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10",
    },
    socialItem: {
      default: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground",
    },
    link: {
      default: "text-sm font-medium text-primary hover:underline",
    },
    titleWrapper: {
      default: "flex items-center gap-2",
      [ContentType.LINK]: "flex items-center gap-3",
      [ContentType.CATEGORY]: "flex items-center gap-2",
      [ContentType.PRODUCT]: "flex items-center justify-between",
      [ContentType.SOCIAL]: "flex items-center gap-3",
    },
    categoriesList: {
      default: "no-scrollbar flex items-center gap-2 overflow-x-auto pb-2",
    },
    socialLinksList: {
      default: "flex flex-wrap items-center justify-center gap-4",
    },
  };

  // Get the base class for the component and element type
  const baseClass = commonBaseClasses[elementType]?.[componentType] || commonBaseClasses[elementType]?.default || "";

  // Add alignment class if applicable
  const alignClass = elementType === "container" || elementType === "title" || elementType === "description" ? alignmentClasses[alignment] : "";

  return cn(baseClass, alignClass);
}

// Function to get theme-specific classes
function getThemeSpecificClasses(componentType: string, elementType: string, theme: THEMES) {
  // Theme-specific classes for each element type
  const themeSpecificClasses: Record<THEMES, Record<string, Record<string, string>>> = {
    [THEMES.DEFAULT]: {
      // Default theme uses base classes
      card: {
        default: "rounded-lg border bg-card text-card-foreground shadow-sm",
        [ContentType.CATEGORY]: "rounded-lg border border-l-4 border-l-primary bg-card text-card-foreground shadow-sm",
      },
      button: {
        default: "h-9 px-4 py-2 rounded-md",
      },
      badge: {
        default: "rounded-md",
      },
    },
    [THEMES.MODERN]: {
      card: {
        default: "rounded-none border-0 bg-card text-card-foreground shadow-md",
        [ContentType.CATEGORY]: "rounded-none border-l-4 border-l-primary bg-card text-card-foreground shadow-md",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-none bg-primary/10 text-primary",
      },
      button: {
        default: "h-9 px-4 py-2 rounded-none",
      },
      badge: {
        default: "rounded-none",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-none border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10",
      },
      socialItem: {
        default: "flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground",
      },
      imageContainer: {
        [ContentType.PAGE_AVATAR]: "h-32 w-32 overflow-hidden rounded-none border-4 border-primary/20 p-1",
      },
    },
    [THEMES.RETRO]: {
      card: {
        default: "rounded-lg border-2 border-dashed bg-card text-card-foreground shadow-md",
        [ContentType.CATEGORY]: "rounded-lg border-2 border-dashed border-l-4 border-l-primary bg-card text-card-foreground shadow-md",
      },
      title: {
        default: "font-bold",
        [ContentType.PAGE_TITLE]: "text-4xl font-black tracking-tight md:text-5xl uppercase",
      },
      button: {
        default: "h-9 px-4 py-2 rounded-lg border-2",
      },
      badge: {
        default: "rounded-lg border-2",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-lg border-2 border-dashed bg-primary/10 text-primary",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-lg border-2 border-dashed bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-primary/10",
      },
    },
    [THEMES.ELEGANT]: {
      card: {
        default: "rounded-lg border border-border/50 bg-card text-card-foreground shadow-sm",
        [ContentType.CATEGORY]: "rounded-lg border border-border/50 border-l-2 border-l-primary bg-card text-card-foreground shadow-sm",
      },
      title: {
        default: "font-medium",
        [ContentType.PAGE_TITLE]: "text-4xl font-light tracking-tight md:text-5xl",
      },
      description: {
        default: "text-sm text-muted-foreground font-light",
      },
      button: {
        default: "h-9 px-6 py-2 rounded-full",
      },
      badge: {
        default: "rounded-full px-3",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-full bg-primary/5 text-primary",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-full border border-border/50 bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/5",
      },
    },
    [THEMES.CLASSIC]: {
      card: {
        default: "rounded-md border bg-card text-card-foreground shadow",
        [ContentType.CATEGORY]: "rounded-md border border-l-4 border-l-primary bg-card text-card-foreground shadow",
      },
      title: {
        default: "font-semibold",
      },
      button: {
        default: "h-10 px-4 py-2 rounded-md",
      },
      badge: {
        default: "rounded-sm",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-md bg-primary/10 text-primary",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10",
      },
    },
    [THEMES.MINIMAL]: {
      card: {
        default: "border-0 bg-background text-card-foreground",
        [ContentType.CATEGORY]: "border-0 border-l-2 border-l-primary bg-background text-card-foreground pl-4",
      },
      title: {
        default: "font-normal",
        [ContentType.PAGE_TITLE]: "text-4xl font-light tracking-tight md:text-5xl",
      },
      description: {
        default: "text-sm text-muted-foreground font-light",
      },
      button: {
        default: "h-8 px-3 py-1 rounded-none border-b-2 border-primary",
      },
      badge: {
        default: "rounded-none border-0 bg-primary/10 text-primary",
      },
      iconContainer: {
        default: "flex items-center justify-center bg-transparent text-primary",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-none border-b border-border bg-transparent px-3 py-1 text-sm font-normal transition-colors hover:border-primary",
      },
    },
    [THEMES.PLAYFUL]: {
      card: {
        default: "rounded-xl border-2 bg-card text-card-foreground shadow-lg",
        [ContentType.CATEGORY]: "rounded-xl border-2 border-l-8 border-l-primary bg-card text-card-foreground shadow-lg",
      },
      title: {
        default: "font-bold",
        [ContentType.PAGE_TITLE]: "text-4xl font-extrabold tracking-tight md:text-5xl",
      },
      button: {
        default: "h-10 px-5 py-2 rounded-full font-bold",
      },
      badge: {
        default: "rounded-full px-3 py-1 font-bold",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-full bg-primary/20 text-primary",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-full border-2 bg-background px-5 py-2 text-sm font-bold transition-colors hover:bg-primary/20",
      },
    },
    [THEMES.FUTURISTIC]: {
      card: {
        default: "rounded-md border border-primary/20 bg-black/80 text-white backdrop-blur-sm",
        [ContentType.CATEGORY]: "rounded-md border border-primary/20 border-l-4 border-l-primary bg-black/80 text-white backdrop-blur-sm",
      },
      title: {
        default: "font-medium",
        [ContentType.PAGE_TITLE]: "text-4xl font-bold tracking-tight md:text-5xl text-primary",
      },
      description: {
        default: "text-sm text-gray-400",
      },
      button: {
        default: "h-9 px-4 py-2 rounded-sm border border-primary text-primary hover:bg-primary/20",
      },
      badge: {
        default: "rounded-sm border border-primary/50 bg-black/50 text-primary",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-sm bg-black/50 text-primary border border-primary/30",
      },
      categoryItem: {
        default: "flex min-w-fit items-center gap-2 rounded-sm border border-primary/30 bg-black/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 text-white",
      },
    },
    [THEMES.BRUTALIST]: {
      card: {
        default: "rounded-none border-4 border-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        [ContentType.CATEGORY]: "rounded-none border-4 border-black border-l-[16px] border-l-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
      },
      title: {
        default: "font-black uppercase",
        [ContentType.PAGE_TITLE]: "text-4xl font-black uppercase tracking-tight md:text-5xl",
      },
      description: {
        default: "text-sm font-bold",
      },
      button: {
        default:
          "h-10 px-4 py-2 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all",
      },
      badge: {
        default: "rounded-none border-2 border-black bg-white text-black font-bold",
      },
      iconContainer: {
        default: "flex items-center justify-center rounded-none text-black",
      },
      categoryItem: {
        default:
          "flex min-w-fit items-center gap-2 rounded-none border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase transition-colors hover:bg-black hover:text-white",
      },
    },
  };

  // Get the theme-specific class for the component and element type
  return themeSpecificClasses[theme]?.[elementType]?.[componentType] || themeSpecificClasses[theme]?.[elementType]?.default || "";
}
