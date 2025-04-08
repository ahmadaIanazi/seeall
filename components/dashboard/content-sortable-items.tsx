"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_ICONS } from "@/constants/contentTypes";
import { useTheme } from "@/lib/store/theme";
import { ContentType } from "@/types/content-type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Content } from "@prisma/client";
import { Edit, Eye, EyeClosed, GripVertical, Minimize2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { ContentRenderer } from "../components";

interface ContentSortableItemProps {
  content: Content;
  onDelete: (contentId: string) => void;
  toggleVisibility: (contentId: string) => void;
  onEdit: (content: Content) => void;
  editing: boolean;
}

export function ContentSortableItem({ content, onDelete, toggleVisibility, onEdit, editing }: ContentSortableItemProps) {
  const { themeConfig } = useTheme();
  const sortable = useSortable({
    id: content.id,
    // Add these options to improve mobile handling
    transition: {
      duration: 150, // faster transitions feel more responsive on mobile
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const { attributes, listeners, setNodeRef, transform, transition } = sortable;

  const style = transform ? { transform: CSS.Transform.toString(transform), transition } : {};
  const [showMobileControls, setShowMobileControls] = useState(false);
  const contentTypeIcon = DEFAULT_ICONS[content.type] || DEFAULT_ICONS[ContentType.BLANK];

  if (!editing && !content.visible) return null; // Hide in public mode when not visible

  return (
    <div ref={setNodeRef} style={style} className={`w-full ${editing && !content.visible ? "opacity-50" : ""}`}>
      <div className={`${editing ? "hover:border-muted-foreground transition-all duration-200" : ""} group relative`}>
        {editing && (
          <div className='absolute top-2 right-2 md:hidden z-10'>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => setShowMobileControls(!showMobileControls)}>
              {showMobileControls ? <Minimize2 className='h-4 w-4' /> : <MoreHorizontal className='h-4 w-4' />}
            </Button>
          </div>
        )}

        {/* Controls container with conditional visibility */}
        {editing && (
          <div
            className={`flex justify-between items-center mb-2 
            md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200
            ${!showMobileControls ? "hidden md:flex" : "flex"}`}
          >
            <div className={`flex items-center gap-2 ${editing ? "cursor-default" : "cursor-move"}`} {...attributes} {...listeners}>
              <GripVertical className='h-4 w-4 text-muted-foreground' />
              {contentTypeIcon}
              <p className='text-sm truncate'>{content.type.charAt(0).toUpperCase() + content.type.slice(1).toLowerCase()}</p>
            </div>
            <div className='flex gap-1'>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => toggleVisibility(content.id)}>
                {content.visible ? <Eye className='h-4 w-4' /> : <EyeClosed className='h-4 w-4' />}
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => onEdit(content)}>
                <Edit className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => onDelete(content.id)}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}

        <ContentRenderer content={content} themeConfig={themeConfig} />
      </div>
    </div>
  );
}
