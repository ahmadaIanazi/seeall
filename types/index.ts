// Define content type enum
export enum ContentType {
  LINK = "LINK",
  IMAGE = "IMAGE",
  CATEGORY = "CATEGORY",
  PRODUCT = "PRODUCT",
  SOCIAL = "SOCIAL",
  BUTTON = "BUTTON",
  BLANK = "BLANK",
  PAGE_TITLE = "PAGE_TITLE",
  PAGE_AVATAR = "PAGE_AVATAR",
  PAGE_BIO = "PAGE_BIO",
  SOCIAL_LINKS = "SOCIAL_LINKS",
  CATEGORIES_LIST = "CATEGORIES_LIST",
}

// Define content model
export interface ContentTypeModel {
  type: ContentType;
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  url?: string;
  price?: number;
  currency?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
    icon?: string;
    image?: string;
    url?: string;
  }>;
}

// Theme options
export enum THEMES {
  /**
   * Default ShadCN styling - clean, minimal, and balanced.
   * - **Primary**: Used for interactive elements like buttons and active states.
   * - **Containers**: Subtle shadows and soft rounded corners.
   * - **Borders**: Light and minimal, only where necessary.
   * - **Text**: Readable and neutral, with clear hierarchy.
   */
  DEFAULT = "DEFAULT",

  /**
   * Modern styling - sleek and high contrast.
   * - **Primary**: Applied to bold elements like buttons and headings.
   * - **Containers**: Sharp edges, subtle depth, and glassmorphism effects.
   * - **Borders**: Minimal, sometimes removed for a seamless look.
   * - **Text**: Clean, sans-serif, with strategic weight variations.
   */
  MODERN = "MODERN",

  /**
   * Retro styling - nostalgic with a vintage touch.
   * - **Primary**: Used in buttons, headlines, and key UI elements.
   * - **Containers**: Rounded or slightly irregular edges for a soft feel.
   * - **Borders**: Prominent and slightly thicker for a retro aesthetic.
   * - **Text**: Often bold and stylized, inspired by old-school typography.
   */
  RETRO = "RETRO",

  /**
   * Elegant styling - refined and sophisticated.
   * - **Primary**: Used subtly in typography, icons, and accents.
   * - **Containers**: Smooth, luxurious feel with soft curves.
   * - **Borders**: Thin, delicate, and barely noticeable.
   * - **Text**: Serif fonts or fine-line typography with high readability.
   */
  ELEGANT = "ELEGANT",

  /**
   * Classic styling - timeless and structured.
   * - **Primary**: Applied to important elements like headers and buttons.
   * - **Containers**: Balanced, with subtle box shadows and structured layouts.
   * - **Borders**: Well-defined, clear, and slightly prominent.
   * - **Text**: Strong, reliable fonts with traditional styling.
   */
  CLASSIC = "CLASSIC",

  /**
   * Minimalistic styling - clean and spacious.
   * - **Primary**: Used sparingly for interactive elements.
   * - **Containers**: Light, with little to no depth or shadow.
   * - **Borders**: Almost invisible, relying on spacing for separation.
   * - **Text**: Thin, modern, and often monochrome.
   */
  MINIMAL = "MINIMAL",

  /**
   * Playful styling - fun and energetic.
   * - **Primary**: Dominant in buttons, icons, and key interactive elements.
   * - **Containers**: Rounded, soft, and friendly in appearance.
   * - **Borders**: Bright, thick, and sometimes dashed for a playful feel.
   * - **Text**: Quirky fonts with varied weights for a fun experience.
   */
  PLAYFUL = "PLAYFUL",

  /**
   * Futuristic styling - high-tech and digital.
   * - **Primary**: Used in glowing effects, buttons, and cyber-style highlights.
   * - **Containers**: Often transparent, sleek, with digital depth.
   * - **Borders**: Sharp, glowing, or neon-like.
   * - **Text**: Geometric, tech-inspired fonts with high contrast.
   */
  FUTURISTIC = "FUTURISTIC",

  /**
   * Brutalist styling - raw, bold, and high-impact.
   * - **Primary**: Strongly applied to text, buttons, and key UI elements.
   * - **Containers**: Large, blocky, and industrial in feel.
   * - **Borders**: Thick, harsh, and often over-emphasized.
   * - **Text**: Large, uppercase, and high-contrast with stark readability.
   */
  BRUTALIST = "BRUTALIST",
}

export type Alignment = "left" | "center" | "right";

export interface ThemeConfig {
  theme: THEMES | typeof THEMES;
  alignment: Alignment;
  primaryColor?: string;
}
