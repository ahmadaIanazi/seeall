"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDashboardStore } from "@/lib/store/dashboard";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Heading, Image as ImageIcon, Link as LinkIcon, MapPin, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { LinkTypeSelector } from "./link-type-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Link } from "@prisma/client";

// ✅ Define Props
interface PageContentManagerProps {
  initialContent: Link[];
  pageId: string;
}

// ✅ SortableItem Component (Handles Drag & Drop)
function SortableItem({ link, onDelete }: { link: Link; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className='flex items-center gap-4 rounded-lg border p-4'>
      <div {...attributes} {...listeners} className='cursor-move'>
        <GripVertical className='h-5 w-5 text-muted-foreground' />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          {getLinkIcon(link.type)}
          <p className='font-medium truncate'>{link.title}</p>
        </div>
        {link.type === "image" && link.image && (
          <div className='relative w-full h-32 mt-2'>
            <Image src={link.image} alt={link.title} fill className='object-cover rounded-lg' />
          </div>
        )}
        {link.type !== "header" && <p className='text-sm text-muted-foreground truncate'>{link.type === "map" ? "Map Location" : link.url}</p>}
      </div>
      <Button variant='ghost' size='icon' onClick={() => onDelete(link.id)}>
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

// ✅ Get Correct Icon for Each Content Type
function getLinkIcon(type: string) {
  switch (type) {
    case "link":
      return <LinkIcon className='h-4 w-4' />;
    case "image":
      return <ImageIcon className='h-4 w-4' />;
    case "map":
      return <MapPin className='h-4 w-4' />;
    case "header":
      return <Heading className='h-4 w-4' />;
    default:
      return <LinkIcon className='h-4 w-4' />;
  }
}

// ✅ PageContentManager Component (Main Component)
export function PageContentManager({ initialContent, pageId }: PageContentManagerProps) {
  const { links, setLinks, addLink, removeLink, reorderLinks } = useDashboardStore();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Load Initial Content into Zustand Store
  useEffect(() => {
    setLinks(initialContent);
  }, [initialContent, setLinks]);

  useEffect(() => {
    if (!showForm) {
      setTimeout(() => {
        document.getElementById("add-link-button")?.focus(); // Refocus on Add button
      }, 100);
    }
  }, [showForm]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ✅ Handle Adding a New Content Block
  function handleAddLink(formData: FormData) {
    try {
      const title = formData.get("title") as string;
      if (!title) throw new Error("Title is required");

      const newLink: Link = {
        id: crypto.randomUUID(),
        type: selectedType || "link",
        title,
        url: formData.get("url") as string | null,
        image: formData.get("image") as string | null,
        description: formData.get("description") as string | null,
        order: links.length,
        pageId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addLink(newLink);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  }

  // ✅ Handle Drag & Drop Sorting
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);

      const updatedLinks = arrayMove(links, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));

      reorderLinks(updatedLinks);
    }
  }

  return (
    <div className='space-y-6'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={(links || []).map((link) => link.id)} strategy={verticalListSortingStrategy}>
          {(links || []).map((link) => (
            <SortableItem key={link.id} link={link} onDelete={removeLink} />
          ))}
        </SortableContext>
      </DndContext>

      {/* ✅ Dialog for Selecting Content Type */}
      <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
        <DialogTrigger asChild>
          <Button className='w-full' variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Choose Content Type</DialogTitle>
          <LinkTypeSelector
            onSelect={(type) => {
              setSelectedType(type);
              setIsAddingLink(false);
              setShowForm(true);
            }}
            onClose={() => setIsAddingLink(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Sheet to Input Content Details */}
      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>
              Add {selectedType?.charAt(0).toUpperCase()}
              {selectedType?.slice(1)}
            </SheetTitle>
          </SheetHeader>
          <div className='p-6'>
            {selectedType && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddLink(new FormData(e.currentTarget));
                }}
                className='space-y-4'
              >
                <Label>Title</Label>
                <Input name='title' placeholder='Enter title' required />

                {selectedType === "link" && (
                  <>
                    <Label>URL</Label>
                    <Input name='url' type='url' placeholder='https://example.com' required />
                  </>
                )}

                {selectedType === "image" && <ImageUpload name='image' />}

                <Button id='add-link-button' type='submit'>
                  Add
                </Button>
              </form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
