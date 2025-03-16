import { THEMES } from "@/types/content-type";

export type StylesType = {
  // Main containers
  container: string;
  contentContainer: string;
  controlsContainer: string;
  dropdownControlsContainer: string;

  // Content elements based on type
  contentItem: string;

  // Common content components
  title: {
    base: string;
    container: string;
    style: Record<string, any>;
  };
  description: string;
  avatar: string;
  image: string;
  url: string;
  price: string;
  currency: string;
  button: string;

  // Icons
  icon: {
    wrapper: string;
    style: Record<string, any>;
  };

  // Alignment and other utilities
  alignment: string;

  // Visual styling
  borderRadius: string;
  borderStyle: string;
  shadow: string;
  padding: string;
  textWeight: string;
  headingWeight: string;
};

export function getThemeStyles(theme: string, alignment: string, primaryColor?: string): StylesType {
  // Determine alignment class
  let alignmentClass = "";
  switch (alignment) {
    case "center":
      alignmentClass = "text-center mx-auto";
      break;
    case "right":
      alignmentClass = "text-right ml-auto";
      break;
    default:
      alignmentClass = "text-left";
      break;
  }

  // Helper function to get color styles
  const getColorStyle = (type: string) => {
    if (!primaryColor) return {};

    switch (type) {
      case "title":
        return { color: primaryColor };
      case "link":
        return { color: primaryColor };
      case "border":
        return { borderColor: primaryColor };
      case "categoryBorder":
        return { borderLeftColor: primaryColor, borderLeftWidth: "4px" };
      case "icon":
        return { color: primaryColor };
      default:
        return {};
    }
  };

  // Define theme styles
  switch (theme) {
    case THEMES.DEFAULT:
      return {
        // Main containers
        container: `w-full rounded-lg border border-primary shadow-md`,
        contentContainer: `p-4 w-full gap-2 ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-4 py-2 bg-muted rounded-t-lg`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-4 pe-12 py-2 bg-muted rounded-t-lg`,

        // Content elements based on type
        contentItem: "flex flex-col gap-2",

        // Common content components
        title: {
          base: "font-semibold",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },

        description: "text-sm",
        image: "object-cover w-full max-h-60 rounded-md",
        url: "text-sm truncate",
        price: "text-sm font-medium",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-90",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-lg",
        borderStyle: "border border-primary",
        shadow: "shadow-md",
        padding: "p-4",
        textWeight: "font-normal",
        headingWeight: "font-semibold",
      };

    case THEMES.MODERN:
      return {
        // Main containers
        container: `w-full rounded-xl border border-transparent shadow-lg`,
        contentContainer: `p-6 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-6 py-3 bg-muted rounded-t-xl`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-6 pe-12 py-3 bg-muted rounded-t-xl`,

        // Content elements based on type
        contentItem: "flex flex-col gap-3",

        // Common content components
        title: {
          base: "font-bold",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm",
        image: "object-cover w-full max-h-60 rounded-xl",
        url: "text-sm truncate",
        price: "text-base font-medium",

        // Icons and buttons
        icon: {
          wrapper: "h-5 w-5",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-80",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-xl",
        borderStyle: "border border-transparent",
        shadow: "shadow-lg",
        padding: "p-6",
        textWeight: "font-medium",
        headingWeight: "font-bold",
      };

    case THEMES.RETRO:
      return {
        // Main containers
        container: `w-full rounded-md border border-primary shadow-none`,
        contentContainer: `p-5 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-5 py-2 bg-muted rounded-t-md`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-5 pe-12 py-2 bg-muted rounded-t-md`,

        // Content elements based on type
        contentItem: "flex flex-col gap-2",

        // Common content components
        title: {
          base: "font-extrabold",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-bold",
        image: "object-cover w-full max-h-60 rounded-none border-2",
        url: "text-sm truncate font-bold",
        price: "text-sm font-extrabold",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-85",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-md",
        borderStyle: "border border-primary",
        shadow: "shadow-none",
        padding: "p-5",
        textWeight: "font-bold",
        headingWeight: "font-extrabold",
      };

    case THEMES.ELEGANT:
      return {
        // Main containers
        container: `w-full rounded-lg border border-primary shadow-sm`,
        contentContainer: `p-6 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-6 py-3 bg-muted rounded-t-lg`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-6 pe-12 py-3 bg-muted rounded-t-lg`,

        // Content elements based on type
        contentItem: "flex flex-col gap-3",

        // Common content components
        title: {
          base: "font-medium",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-light",
        image: "object-cover w-full max-h-60 rounded-md shadow-md",
        url: "text-sm truncate font-light",
        price: "text-sm font-medium",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-90",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-lg",
        borderStyle: "border border-primary",
        shadow: "shadow-sm",
        padding: "p-6",
        textWeight: "font-light",
        headingWeight: "font-medium",
      };

    case THEMES.CLASSIC:
      return {
        // Main containers
        container: `w-full rounded-md border border-primary shadow-md`,
        contentContainer: `p-4 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-4 py-2 bg-muted rounded-t-md`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-4 pe-12 py-2 bg-muted rounded-t-md`,

        // Content elements based on type
        contentItem: "flex flex-col gap-2",

        // Common content components
        title: {
          base: "font-bold",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-semibold",
        image: "object-cover w-full max-h-60 rounded-md border",
        url: "text-sm truncate font-semibold",
        price: "text-sm font-bold",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-85",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-md",
        borderStyle: "border border-primary",
        shadow: "shadow-md",
        padding: "p-4",
        textWeight: "font-semibold",
        headingWeight: "font-bold",
      };

    case THEMES.MINIMAL:
      return {
        // Main containers
        container: `w-full rounded-md border border-transparent shadow-none`,
        contentContainer: `p-4 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-4 py-2 bg-muted rounded-t-md`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-4 pe-12 py-2 bg-muted rounded-t-md`,

        // Content elements based on type
        contentItem: "flex flex-col gap-2",

        // Common content components
        title: {
          base: "font-thin",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-light",
        image: "object-cover w-full max-h-60 rounded-md",
        url: "text-sm truncate font-light",
        price: "text-sm font-thin",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-80",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-md",
        borderStyle: "border border-transparent",
        shadow: "shadow-none",
        padding: "p-4",
        textWeight: "font-light",
        headingWeight: "font-thin",
      };

    case THEMES.PLAYFUL:
      return {
        // Main containers
        container: `w-full rounded-xl border border-primary shadow-lg`,
        contentContainer: `p-6 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-6 py-3 bg-muted rounded-t-xl`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-6 pe-12 py-3 bg-muted rounded-t-xl`,

        // Content elements based on type
        contentItem: "flex flex-col gap-3",

        // Common content components
        title: {
          base: "font-black",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-bold",
        image: "object-cover w-full max-h-60 rounded-xl transform -rotate-1",
        url: "text-sm truncate font-bold",
        price: "text-sm font-black",

        // Icons and buttons
        icon: {
          wrapper: "h-5 w-5",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-80 transform transition-transform hover:scale-105",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-xl",
        borderStyle: "border border-primary",
        shadow: "shadow-lg",
        padding: "p-6",
        textWeight: "font-bold",
        headingWeight: "font-black",
      };

    case THEMES.FUTURISTIC:
      return {
        // Main containers
        container: `w-full rounded-md border border-primary shadow-lg`,
        contentContainer: `p-5 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-5 py-2 bg-muted backdrop-blur-sm rounded-t-md`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-5 pe-12 py-2 bg-muted backdrop-blur-sm rounded-t-md`,

        // Content elements based on type
        contentItem: "flex flex-col gap-2",

        // Common content components
        title: {
          base: "font-bold",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-medium",
        image: "object-cover w-full max-h-60 rounded-md",
        url: "text-sm truncate font-medium",
        price: "text-sm font-bold",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-85 backdrop-blur-sm",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-md",
        borderStyle: "border border-primary",
        shadow: "shadow-lg",
        padding: "p-5",
        textWeight: "font-medium",
        headingWeight: "font-bold",
      };

    case THEMES.BRUTALIST:
      return {
        // Main containers
        container: `w-full rounded-none border-2 border-primary shadow-none`,
        contentContainer: `p-4 w-full ${alignmentClass}`,
        controlsContainer: `flex items-center justify-between px-4 py-2 bg-muted rounded-none`,
        dropdownControlsContainer: `md:hidden flex md:group-hover:flex items-center justify-between px-4 pe-12 py-2 bg-muted rounded-none`,

        // Content elements based on type
        contentItem: "flex flex-col gap-2",

        // Common content components
        title: {
          base: "font-black uppercase",
          container: "flex flex-row gap-2 items-center",
          style: getColorStyle("title"),
        },
        description: "text-sm font-extrabold",
        image: "object-cover w-full max-h-60 rounded-none border-2",
        url: "text-sm truncate font-extrabold",
        price: "text-sm font-black",

        // Icons and buttons
        icon: {
          wrapper: "h-4 w-4",
          style: getColorStyle("icon"),
        },
        button: "bg-primary hover:opacity-75",

        // Alignment and other utilities
        alignment: alignmentClass,

        // Visual styling
        borderRadius: "rounded-none",
        borderStyle: "border-2 border-primary",
        shadow: "shadow-none",
        padding: "p-4",
        textWeight: "font-extrabold",
        headingWeight: "font-black",
      };

    default:
      return getThemeStyles(THEMES.DEFAULT, "center", "#000000");
  }
}
