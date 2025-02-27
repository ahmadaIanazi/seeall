"use client";

import { Link } from "@prisma/client";
import { Trash2 } from "lucide-react";

interface LinkListProps {
  links: Link[];
  isEditing?: boolean;
  onDelete?: (id: string) => void;
  dragHandleProps?: any;
}

export function LinkList({ links, isEditing, onDelete, dragHandleProps }: LinkListProps) {
  if (links.length === 0) {
    return <div className='text-center text-muted-foreground py-8'>No links added yet</div>;
  }

  return (
    <div className='space-y-3 w-full max-w-md mx-auto'>
      {links.map((link) => (
        <a
          key={link.id}
          href={isEditing ? undefined : link.url}
          target={isEditing ? undefined : "_blank"}
          rel='noopener noreferrer'
          className='block p-4 rounded-lg border hover:bg-muted transition-colors'
        >
          <div className='flex items-center gap-3'>
            {isEditing && dragHandleProps}
            <div className='flex-1 min-w-0'>
              <p className='font-medium truncate'>{link.title}</p>
              <p className='text-sm text-muted-foreground truncate'>{link.url}</p>
            </div>
            {isEditing && onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(link.id);
                }}
                className='text-muted-foreground hover:text-destructive'
              >
                <Trash2 className='h-4 w-4' />
              </button>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
