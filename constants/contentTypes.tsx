import { Icon } from "@/components/ui/icon";
import { ContentType } from "@/types";

// Default icons as components
export const DEFAULT_ICONS = {
  [ContentType.LINK]: <Icon name='Link' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.IMAGE]: <Icon name='Image' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.CATEGORY]: <Icon name='Heading' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.PRODUCT]: <Icon name='ShoppingCart' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.SOCIAL]: <Icon name='Users' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.BLANK]: <Icon name='BookOpen' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.PAGE_TITLE]: <Icon name='Layers' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.PAGE_AVATAR]: <Icon name='User' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.PAGE_BIO]: <Icon name='User' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.SOCIAL_LINKS]: <Icon name='LinkIcon' className='h-4 w-4 text-muted-foreground' />,
  [ContentType.CATEGORIES_LIST]: <Icon name='Layers' className='h-4 w-4 text-muted-foreground' />,
};

export const CONTENT_TYPES = [
  {
    id: ContentType.LINK,
    icon: <Icon name='Link' className='size-6' />,
    label: "Link",
    description: "Add a direct link to any URL.",
  },
  {
    id: ContentType.IMAGE,
    icon: <Icon name='Image' className='size-6' />,
    label: "Image",
    description: "Add a link with a custom preview image.",
  },
  {
    id: ContentType.CATEGORY,
    icon: <Icon name='Heading' className='size-6' />,
    label: "Section",
    description: "Create a heading to group related links.",
  },
  {
    id: ContentType.PRODUCT,
    icon: <Icon name='ShoppingCart' className='size-6' />,
    label: "Product",
    description: "Showcase a product with an image and price.",
  },
  {
    id: ContentType.SOCIAL,
    icon: <Icon name='Users' className='size-6' />,
    label: "Social Link",
    description: "Add a link to a social media profile.",
  },
  {
    id: ContentType.BLANK,
    icon: <Icon name='BookOpen' className='size-6' />,
    label: "Blank",
    description: "Start with an empty component.",
  },
] as const;
