import { THEMES } from "@/types/content-type";

export function getThemeStyles(theme: string, alignment: string, primaryColor?: string) {
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

  switch (theme) {
    case THEMES.DEFAULT:
      return {
        borderRadius: "rounded-lg",
        borderStyle: "border border-primary",
        shadow: "shadow-md",
        padding: "p-4",
        textWeight: "font-normal",
        headingWeight: "font-semibold",
        button: "bg-primary hover:opacity-90",
        container: "p-6 shadow-sm",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-md",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    case THEMES.MODERN:
      return {
        borderRadius: "rounded-xl",
        borderStyle: "border border-transparent",
        shadow: "shadow-lg",
        padding: "p-6",
        textWeight: "font-medium",
        headingWeight: "font-bold",
        button: "bg-primary hover:opacity-80",
        container: "p-8 shadow-md",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-md",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    case THEMES.RETRO:
      return {
        borderRadius: "rounded-md",
        borderStyle: "border border-primary",
        shadow: "shadow-none",
        padding: "p-5",
        textWeight: "font-bold",
        headingWeight: "font-extrabold",
        button: "bg-primary hover:opacity-85",
        container: "p-6 border-dashed",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2 border-l-4",
        imageClasses: "object-cover w-full max-h-60 rounded-none border-2",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: { borderLeftColor: primaryColor, borderLeftWidth: "4px" },
          icon: {},
        },
      };

    case THEMES.ELEGANT:
      return {
        borderRadius: "rounded-lg",
        borderStyle: "border border-primary",
        shadow: "shadow-sm",
        padding: "p-6",
        textWeight: "font-light",
        headingWeight: "font-medium",
        button: "bg-primary hover:opacity-90",
        container: "p-8 shadow-md rounded-xl",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-3",
        imageClasses: "object-cover w-full max-h-60 rounded-md shadow-md",
        primaryColorStyles: {
          title: { color: primaryColor },
          link: { color: primaryColor },
          categoryBorder: {},
          icon: { color: primaryColor },
        },
      };

    case THEMES.CLASSIC:
      return {
        borderRadius: "rounded-md",
        borderStyle: "border border-primary",
        shadow: "shadow-md",
        padding: "p-4",
        textWeight: "font-semibold",
        headingWeight: "font-bold",
        button: "bg-primary hover:opacity-85",
        container: "p-6 border-solid",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-md border",
        primaryColorStyles: {
          title: { color: primaryColor },
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    case THEMES.MINIMAL:
      return {
        borderRadius: "rounded-md",
        borderStyle: "border border-transparent",
        shadow: "shadow-none",
        padding: "p-4",
        textWeight: "font-light",
        headingWeight: "font-thin",
        button: "bg-primary hover:opacity-80",
        container: "p-5",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-md",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    case THEMES.PLAYFUL:
      return {
        borderRadius: "rounded-xl",
        borderStyle: "border border-primary",
        shadow: "shadow-lg",
        padding: "p-6",
        textWeight: "font-bold",
        headingWeight: "font-black",
        button: "bg-primary hover:opacity-80",
        container: "p-8 rounded-xl",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-md",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    case THEMES.FUTURISTIC:
      return {
        borderRadius: "rounded-md",
        borderStyle: "border border-primary",
        shadow: "shadow-lg",
        padding: "p-5",
        textWeight: "font-medium",
        headingWeight: "font-bold",
        button: "bg-primary hover:opacity-85",
        container: "p-7 border-glow",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-md",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    case THEMES.BRUTALIST:
      return {
        borderRadius: "rounded-none",
        borderStyle: "border border-primary",
        shadow: "shadow-none",
        padding: "p-4",
        textWeight: "font-extrabold",
        headingWeight: "font-black",
        button: "bg-primary hover:opacity-75",
        container: "p-6 border-2",
        alignmentClass,
        contentTypeClasses: "flex flex-col gap-2",
        imageClasses: "object-cover w-full max-h-60 rounded-none",
        primaryColorStyles: {
          title: {},
          link: { color: primaryColor },
          categoryBorder: {},
          icon: {},
        },
      };

    default:
      return getThemeStyles(THEMES.DEFAULT, alignment, primaryColor);
  }
}
