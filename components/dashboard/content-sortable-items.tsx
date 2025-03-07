"use client";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store/dashboard";
import { ContentType } from "@/types/content-type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Eye, File, Folder, GripVertical, Image as ImageIcon, Link, Minimize2, MoreHorizontal, ShoppingCart, Star, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const DEFAULT_ICONS = {
  [ContentType.LINK]: <Link className='h-4 w-4 text-muted-foreground' />,
  [ContentType.IMAGE]: <ImageIcon className='h-4 w-4 text-muted-foreground' />,
  [ContentType.CATEGORY]: <Folder className='h-4 w-4 text-muted-foreground' />,
  [ContentType.ICON]: <Star className='h-4 w-4 text-muted-foreground' />,
  [ContentType.PRODUCT]: <ShoppingCart className='h-4 w-4 text-muted-foreground' />,
  [ContentType.SOCIAL]: <Users className='h-4 w-4 text-muted-foreground' />,
  [ContentType.BLANK]: <File className='h-4 w-4 text-muted-foreground' />,
};

export function ContentSortableItem({ content, onDelete }) {
  const { page } = useDashboardStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: content.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const iconElement = content.icon ? <span className='h-4 w-4'>{content.icon}</span> : DEFAULT_ICONS[content.type] || DEFAULT_ICONS[ContentType.BLANK];
  const [showControls, setShowControls] = useState(false);

  // Get styling variables from the dashboard store
  const alignment = page.alignment; // 'center', 'left', 'right'
  const backgroundColor = page.backgroundColor; // hex code or rgba
  const primaryColor = page.brandColor; // hex code or rgba
  const theme = page.style; // theme of "rounded, squared, circle (Full rounding), retro, elegant, classic"

  // Toggle controls visibility manually (for mobile)
  const toggleControls = (e) => {
    e.stopPropagation(); // Prevent triggering other click events
    setShowControls(!showControls);
  };

  // Generate dynamic styles based on theme
  const getThemeStyles = () => {
    // Base styles that will be modified based on theme
    let borderRadius = "rounded-lg";
    let borderStyle = "border";
    let shadowStyle = "shadow-sm";
    let contentPadding = "p-4";

    // Apply theme-specific styles
    switch (theme) {
      case "squared":
        borderRadius = "rounded-none";
        break;
      case "circle":
        borderRadius = "rounded-3xl";
        break;
      case "retro":
        borderRadius = "rounded-none";
        borderStyle = "border-2";
        shadowStyle = "shadow-md";
        break;
      case "elegant":
        shadowStyle = "shadow-lg";
        contentPadding = "p-6";
        break;
      case "classic":
        borderRadius = "rounded-md";
        borderStyle = "border-2";
        break;
      default: // 'rounded' is default
        break;
    }

    return {
      borderRadius,
      borderStyle,
      shadowStyle,
      contentPadding,
    };
  };

  // Get alignment class
  const getAlignmentClass = () => {
    switch (alignment) {
      case "center":
        return "text-center mx-auto";
      case "right":
        return "text-right ml-auto";
      case "left":
      default:
        return "text-left";
    }
  };

  // Apply theme styles
  const themeStyles = getThemeStyles();
  const alignmentClass = getAlignmentClass();

  // Inline styles for color-based properties
  const colorStyles = {
    backgroundColor: backgroundColor || "",
    borderColor: showControls || null ? primaryColor || "rgb(209, 213, 219)" : "transparent",
    color: backgroundColor ? getContrastTextColor(backgroundColor) : "",
  };

  // Function to determine if text should be light or dark based on background
  function getContrastTextColor(bgColor) {
    // Simple contrast check - can be enhanced for better accuracy
    if (!bgColor) return "";

    // Convert hex to RGB if it's a hex color
    let r, g, b;
    if (bgColor.startsWith("#")) {
      const hex = bgColor.replace("#", "");
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
    // Parse rgba format
    else if (bgColor.startsWith("rgba")) {
      const rgba = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
      if (rgba) {
        r = parseInt(rgba[1]);
        g = parseInt(rgba[2]);
        b = parseInt(rgba[3]);
      }
    }

    // Calculate relative luminance
    if (r !== undefined && g !== undefined && b !== undefined) {
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#000000" : "#ffffff";
    }

    return "";
  }

  return (
    <div ref={setNodeRef} style={style} className='group relative w-full'>
      <div
        className={`${themeStyles.borderRadius} ${themeStyles.borderStyle} ${themeStyles.shadowStyle} hover:border-muted-foreground transition-all duration-200`}
        style={colorStyles}
      >
        {/* Mobile indicator - always visible on mobile */}
        <div className='absolute top-2 right-2 md:hidden z-10'>
          <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={toggleControls} style={{ color: colorStyles.color || "" }}>
            {showControls ? <Minimize2 className='h-4 w-4' /> : <MoreHorizontal className='h-4 w-4' />}
          </Button>
        </div>

        {/* Control bar that shows on hover (desktop) or when toggled (mobile) */}
        <div
          className={`
            md:hidden ${showControls ? "flex" : "hidden"} 
            md:group-hover:flex items-center justify-between px-4 pe-12 py-2 bg-muted ${themeStyles.borderRadius.replace("lg", "t-lg")}
          `}
        >
          {/* Left side with grip and type */}
          <div {...attributes} {...listeners} className='cursor-move flex items-center gap-2'>
            <GripVertical className='h-4 w-4 text-muted-foreground' />
            {iconElement}
            <p className='font-medium text-sm truncate'>{content.type.charAt(0).toUpperCase() + content.type.slice(1).toLowerCase()}</p>
          </div>

          {/* Right side with action buttons */}
          <div className='flex gap-1'>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </Button>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <Edit className='h-4 w-4 text-muted-foreground' />
            </Button>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => onDelete(content.id)}>
              <Trash2 className='h-4 w-4 text-muted-foreground' />
            </Button>
          </div>
        </div>

        {/* Content area - always visible */}
        <div className={`${themeStyles.contentPadding} w-full ${alignmentClass}`}>
          {renderContentByType(content, {
            primaryColor,
            theme,
            themeStyles,
            alignment,
          })}
        </div>
      </div>
    </div>
  );
}

function renderContentByType(content, styleProps) {
  const { primaryColor, theme, themeStyles, alignment } = styleProps || {};

  // Helper function to get theme-specific classes for each content type
  const getContentTypeClasses = (type) => {
    let classes = "flex flex-col gap-2";

    if (alignment === "center") {
      classes += " items-center";
    } else if (alignment === "right") {
      classes += " items-end";
    }

    // Apply theme-specific modifications
    switch (theme) {
      case "retro":
        if (type === ContentType.CATEGORY) {
          classes += " border-l-4";
          if (primaryColor) {
            classes = classes.replace("border-l-4", ""); // Remove default border
            // Will add inline style with primary color border
          }
        }
        break;
      case "elegant":
        classes += " gap-3";
        break;
      default:
        break;
    }

    return classes;
  };

  // Helper to get theme-specific image styles
  const getImageClasses = () => {
    let imageClasses = "object-cover w-full max-h-60";

    switch (theme) {
      case "squared":
        imageClasses += " rounded-none";
        break;
      case "circle":
        imageClasses += " rounded-3xl";
        break;
      case "retro":
        imageClasses += " rounded-none border-2";
        break;
      case "elegant":
        imageClasses += " rounded-md shadow-md";
        break;
      case "classic":
        imageClasses += " rounded-md border";
        break;
      default: // 'rounded' is default
        imageClasses += " rounded-md";
        break;
    }

    return imageClasses;
  };

  // Create inline styles for elements that need primary color
  const getPrimaryColorStyle = (element) => {
    if (!primaryColor) return {};

    switch (element) {
      case "title":
        return theme === "elegant" || theme === "classic" ? { color: primaryColor } : {};
      case "link":
        return { color: primaryColor };
      case "category-border":
        return theme === "retro" ? { borderLeftColor: primaryColor, borderLeftWidth: "4px" } : {};
      case "icon":
        return theme === "elegant" ? { color: primaryColor } : {};
      default:
        return {};
    }
  };

  const imageClasses = getImageClasses();

  switch (content.type) {
    case ContentType.LINK:
      return (
        <div className={getContentTypeClasses(ContentType.LINK)}>
          {content.title && (
            <p className='font-semibold' style={getPrimaryColorStyle("title")}>
              {content.title}
            </p>
          )}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          <div className='flex items-center flex-wrap gap-2'>
            {content.icon && (
              <span className='h-4 w-4' style={getPrimaryColorStyle("icon")}>
                {content.icon}
              </span>
            )}
            {content.url && (
              <a href={content.url} className='text-sm truncate' style={getPrimaryColorStyle("link")}>
                {content.url}
              </a>
            )}
            {content.price && (
              <p className='text-sm font-medium'>
                {content.price} {content.currency || "USD"}
              </p>
            )}
          </div>
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
        </div>
      );
    case ContentType.IMAGE:
      return (
        <div className={getContentTypeClasses(ContentType.IMAGE)}>
          {content.image && <img src={content.image} alt='' className={imageClasses.replace("max-h-60", "max-h-96")} />}
          {content.title && (
            <p className='font-semibold' style={getPrimaryColorStyle("title")}>
              {content.title}
            </p>
          )}
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-xs truncate' style={getPrimaryColorStyle("link")}>
              {content.url}
            </a>
          )}
          {content.price && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency || "USD"}
            </p>
          )}
          {content.icon && (
            <div className='flex items-center gap-1' style={getPrimaryColorStyle("icon")}>
              {content.icon}
            </div>
          )}
        </div>
      );
    case ContentType.CATEGORY:
      return (
        <div className={getContentTypeClasses(ContentType.CATEGORY)} style={getPrimaryColorStyle("category-border")}>
          {content.title && (
            <h3 className='text-lg font-semibold' style={getPrimaryColorStyle("title")}>
              {content.title}
            </h3>
          )}
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.url && (
            <p className='text-sm truncate' style={getPrimaryColorStyle("link")}>
              {content.url}
            </p>
          )}
          {content.price && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency || "USD"}
            </p>
          )}
          {content.icon && (
            <div className='flex items-center gap-1' style={getPrimaryColorStyle("icon")}>
              {content.icon}
            </div>
          )}
        </div>
      );
    case ContentType.ICON:
      return (
        <div className={getContentTypeClasses(ContentType.ICON)}>
          {content.icon && (
            <div className='text-xl' style={getPrimaryColorStyle("icon")}>
              {content.icon}
            </div>
          )}
          {content.title && (
            <p className='font-semibold' style={getPrimaryColorStyle("title")}>
              {content.title}
            </p>
          )}
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.url && (
            <p className='text-xs truncate' style={getPrimaryColorStyle("link")}>
              {content.url}
            </p>
          )}
          {content.price && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency || "USD"}
            </p>
          )}
        </div>
      );
    case ContentType.PRODUCT:
      return (
        <div className={getContentTypeClasses(ContentType.PRODUCT)}>
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.title && (
            <p className='font-semibold text-lg' style={getPrimaryColorStyle("title")}>
              {content.title}
            </p>
          )}
          {content.price && (
            <p className='text-base font-medium'>
              {content.price} {content.currency || "USD"}
            </p>
          )}
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={getPrimaryColorStyle("link")}>
              View More
            </a>
          )}
          {content.icon && (
            <div className='flex items-center gap-1' style={getPrimaryColorStyle("icon")}>
              {content.icon}
            </div>
          )}
        </div>
      );
    case ContentType.SOCIAL:
      return (
        <div className={getContentTypeClasses(ContentType.SOCIAL)}>
          <div className='flex items-center gap-2'>
            {content.image && (
              <Image src={content.image} alt='' width={40} height={40} className={theme === "squared" ? "rounded-none object-cover" : "rounded-full object-cover"} />
            )}
            {content.icon && (
              <span className='h-4 w-4' style={getPrimaryColorStyle("icon")}>
                {content.icon}
              </span>
            )}
            {content.title && (
              <p className='font-semibold' style={getPrimaryColorStyle("title")}>
                {content.title}
              </p>
            )}
          </div>
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={getPrimaryColorStyle("link")}>
              {content.url}
            </a>
          )}
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
          {content.price && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency || "USD"}
            </p>
          )}
        </div>
      );
    case ContentType.BLANK:
    default:
      return (
        <div className={getContentTypeClasses(ContentType.BLANK)}>
          {content.icon && (
            <span className='h-4 w-4' style={getPrimaryColorStyle("icon")}>
              {content.icon}
            </span>
          )}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.title && (
            <p className='font-semibold' style={getPrimaryColorStyle("title")}>
              {content.title}
            </p>
          )}
          {content.description && <p className='text-sm text-muted-foreground'>{content.description}</p>}
          {content.url && (
            <p className='text-sm truncate' style={getPrimaryColorStyle("link")}>
              {content.url}
            </p>
          )}
          {content.price && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency || "USD"}
            </p>
          )}
        </div>
      );
  }
}
