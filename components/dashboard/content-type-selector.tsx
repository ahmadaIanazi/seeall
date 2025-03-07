"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentType } from "@/types/content-type";
import { Link, MapPin, Image, Heading } from "lucide-react";

const CONTENT_TYPES = [
  {
    id: ContentType.LINK,
    icon: Link,
    label: "Link",
    description: "Add a simple link to any URL",
  },
  {
    id: ContentType.IMAGE,
    icon: Image,
    label: "Image",
    description: "Add a link with a custom image",
  },
  {
    id: ContentType.ICON,
    icon: MapPin,
    label: "Icon",
    description: "Add a Google Maps location",
  },
  {
    id: ContentType.CATEGORY,
    icon: Heading,
    label: "Section",
    description: "Add a header to organize your links",
  },
  {
    id: ContentType.PRODUCT,
    icon: Heading,
    label: "Product",
    description: "Add a product to with image and prices.",
  },
  {
    id: ContentType.SOCIAL,
    icon: Heading,
    label: "Social Link",
    description: "Add a header to organize your links",
  },
  {
    id: ContentType.BLANK,
    icon: Heading,
    label: "Blank",
    description: "Start with a blank component.",
  },
] as const;

interface ContentTypeSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

export function ContentTypeSelector({ onSelect, onClose }: ContentTypeSelectorProps) {
  return (
    <Card className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {CONTENT_TYPES.map((type) => (
        <Button
          key={type.id}
          variant='outline'
          className='h-auto p-4 flex flex-col items-center gap-2'
          onClick={() => {
            onSelect(type.id);
            onClose();
          }}
        >
          <type.icon className='h-6 w-6' />
          <div className='text-sm font-medium'>{type.label}</div>
          <div className='text-xs text-muted-foreground text-center'>{type.description}</div>
        </Button>
      ))}
    </Card>
  );
}
