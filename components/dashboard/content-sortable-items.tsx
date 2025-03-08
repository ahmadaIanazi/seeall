"use client";
import { Button } from "@/components/ui/button";
import { DEFAULT_ICONS } from "@/constants/contentTypes";
import { useDashboardStore } from "@/lib/store/dashboard";
import { ContentType } from "@/types/content-type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentType as ContentTypeModel } from "@prisma/client";
import { Edit, Eye, EyeClosed, GripVertical, Minimize2, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { getThemeStyles } from "@/lib/utils/style";

interface ContentSortableItemProps {
  content: ContentTypeModel;
  onDelete: (contentId: string) => void;
  toggleVisibility: (contentId: string) => void;
  onEdit: (content: ContentTypeModel) => void;
  publicMode: boolean;
}

export function ContentSortableItem({ content, onDelete, toggleVisibility, onEdit, publicMode }: ContentSortableItemProps) {
  const { page } = useDashboardStore();
  const sortable = useSortable({ id: content.id });

  const { attributes, listeners, setNodeRef, transform, transition } = !publicMode
    ? sortable
    : { attributes: {}, listeners: {}, setNodeRef: null, transform: null, transition: null };

  const style = !publicMode ? { transform: CSS.Transform.toString(transform), transition } : {};
  const [showControls, setShowControls] = useState(false);
  const contentTypeIcon = DEFAULT_ICONS[content.type] || DEFAULT_ICONS[ContentType.BLANK];

  // Extract styles from getThemeStyles
  const { borderRadius, borderStyle, shadow, padding, textWeight, headingWeight, button, container, alignmentClass, contentTypeClasses, imageClasses, primaryColorStyles } =
    getThemeStyles(page.style, page.alignment, page.brandColor);

  if (publicMode && !content.visible) return null;

  return (
    <div
      ref={!publicMode ? setNodeRef : undefined}
      style={style}
      className={`${!publicMode ? "group relative" : ""} w-full ${!publicMode && !content.visible ? "opacity-50" : ""}`}
    >
      <div className={`${borderRadius} ${borderStyle} ${shadow} ${!publicMode ? "hover:border-muted-foreground transition-all duration-200" : ""}`}>
        {!publicMode && (
          <div className='absolute top-2 right-2 md:hidden z-10'>
            <Button variant='ghost' size='sm' className={`h-8 w-8 p-0 ${button}`} onClick={() => setShowControls(!showControls)}>
              {showControls ? <Minimize2 className='h-4 w-4' /> : <MoreHorizontal className='h-4 w-4' />}
            </Button>
          </div>
        )}

        {!publicMode && (
          <div
            className={`md:hidden ${showControls ? "flex" : "hidden"} md:group-hover:flex items-center justify-between px-4 pe-12 py-2 bg-muted ${borderRadius.replace(
              "lg",
              "t-lg"
            )}`}
          >
            <div {...attributes} {...listeners} className='cursor-move flex items-center gap-2'>
              <GripVertical className='h-4 w-4 text-muted-foreground' />
              {contentTypeIcon}
              <p className={`${textWeight} text-sm truncate`}>{content.type.charAt(0).toUpperCase() + content.type.slice(1).toLowerCase()}</p>
            </div>
            <div className='flex gap-1'>
              <Button variant='ghost' size='sm' className={`h-8 w-8 p-0 ${button}`} onClick={() => toggleVisibility(content.id)}>
                {content.visible ? <Eye className='h-4 w-4' /> : <EyeClosed className='h-4 w-4' />}
              </Button>
              <Button variant='ghost' size='sm' className={`h-8 w-8 p-0 ${button}`} onClick={() => onEdit(content)}>
                <Edit className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='sm' className={`h-8 w-8 p-0 ${button}`} onClick={() => onDelete(content.id)}>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={`${padding} w-full ${alignmentClass}`}>{renderContentByType(content, contentTypeClasses, imageClasses, primaryColorStyles)}</div>
      </div>
    </div>
  );
}

function renderContentByType(content, contentTypeClasses, imageClasses, primaryColorStyles) {
  const iconElement = content.icon ? (
    <Icon name={content.icon} className='h-4 w-4' style={primaryColorStyles.icon} />
  ) : (
    DEFAULT_ICONS[content.type] || DEFAULT_ICONS[ContentType.BLANK]
  );

  switch (content.type) {
    case ContentType.LINK:
      return (
        <div className={contentTypeClasses}>
          {content.title && (
            <div className='flex flex-row gap-2 items-center'>
              {iconElement}
              <p className='font-semibold' style={primaryColorStyles.title}>
                {content.title}
              </p>
            </div>
          )}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.description && <p className='text-sm'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={primaryColorStyles.link}>
              {content.url}
            </a>
          )}
          {content.price && content.currency && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency}
            </p>
          )}
        </div>
      );

    case ContentType.IMAGE:
      return (
        <div className={contentTypeClasses}>
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.title && (
            <div className='flex flex-row gap-2 items-center'>
              {iconElement}
              <p className='font-semibold' style={primaryColorStyles.title}>
                {content.title}
              </p>
            </div>
          )}
          {content.description && <p className='text-sm'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-xs truncate' style={primaryColorStyles.link}>
              {content.url}
            </a>
          )}
          {content.price && content.currency && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency}
            </p>
          )}
        </div>
      );

    case ContentType.CATEGORY:
      return (
        <div className={contentTypeClasses} style={primaryColorStyles.categoryBorder}>
          {content.title && (
            <div className='flex flex-row gap-2 items-center'>
              {iconElement}
              <h3 className='text-lg font-semibold' style={primaryColorStyles.title}>
                {content.title}
              </h3>
            </div>
          )}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.description && <p className='text-sm'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={primaryColorStyles.link}>
              {content.url}
            </a>
          )}
          {content.price && content.currency && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency}
            </p>
          )}
        </div>
      );

    case ContentType.PRODUCT:
      return (
        <div className={contentTypeClasses}>
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.title && (
            <div className='flex flex-row gap-2 items-center'>
              {iconElement}
              <p className='font-semibold text-lg' style={primaryColorStyles.title}>
                {content.title}
              </p>
            </div>
          )}
          {content.price && content.currency && (
            <p className='text-base font-medium'>
              {content.price} {content.currency}
            </p>
          )}
          {content.description && <p className='text-sm'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={primaryColorStyles.link}>
              View More
            </a>
          )}
        </div>
      );

    case ContentType.SOCIAL:
      return (
        <div className={contentTypeClasses}>
          <div className='flex items-center gap-2'>
            {content.image && <Image src={content.image} alt='' width={40} height={40} className={imageClasses} />}
            {content.title && (
              <div className='flex flex-row gap-2 items-center'>
                {iconElement}
                <p className='font-semibold' style={primaryColorStyles.title}>
                  {content.title}
                </p>
              </div>
            )}
          </div>
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={primaryColorStyles.link}>
              {content.url}
            </a>
          )}
          {content.description && <p className='text-sm'>{content.description}</p>}
          {content.price && content.currency && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency}
            </p>
          )}
        </div>
      );

    case ContentType.BLANK:
    default:
      return (
        <div className={contentTypeClasses}>
          {content.title && (
            <div className='flex flex-row gap-2 items-center'>
              {iconElement}
              <p className='font-semibold' style={primaryColorStyles.title}>
                {content.title}
              </p>
            </div>
          )}
          {content.image && <img src={content.image} alt='' className={imageClasses} />}
          {content.description && <p className='text-sm'>{content.description}</p>}
          {content.url && (
            <a href={content.url} className='text-sm truncate' style={primaryColorStyles.link}>
              {content.url}
            </a>
          )}
          {content.price && content.currency && (
            <p className='text-sm font-medium'>
              {content.price} {content.currency}
            </p>
          )}
        </div>
      );
  }
}
