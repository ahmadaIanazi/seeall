"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, MapPin, Image, Heading } from "lucide-react";

const LINK_TYPES = [
  {
    id: "link",
    icon: Link,
    label: "Link",
    description: "Add a simple link to any URL",
  },
  {
    id: "image",
    icon: Image,
    label: "Image Link",
    description: "Add a link with a custom image",
  },
  {
    id: "map",
    icon: MapPin,
    label: "Map Location",
    description: "Add a Google Maps location",
  },
  {
    id: "header",
    icon: Heading,
    label: "Section Header",
    description: "Add a header to organize your links",
  },
] as const;

interface LinkTypeSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

export function LinkTypeSelector({ onSelect, onClose }: LinkTypeSelectorProps) {
  return (
    <Card className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {LINK_TYPES.map((type) => (
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
