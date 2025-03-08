"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTENT_TYPES } from "@/constants/contentTypes";

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
          {type.icon}
          <div className='text-sm font-medium'>{type.label}</div>
          <div className='text-xs text-muted-foreground text-center'>{type.description}</div>
        </Button>
      ))}
    </Card>
  );
}
