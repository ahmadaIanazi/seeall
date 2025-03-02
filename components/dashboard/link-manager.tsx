"use client";

import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { GripVertical, Plus, Trash2, Link, MapPin, Image as ImageIcon, Heading } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { LinkTypeSelector } from "./link-type-selector";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";
import { useDashboardStore } from "@/lib/store/dashboard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Define the Link type
interface Link {
  id: string;
  type: string;
  title: string;
  url: string | null;
  image: string | null;
  description: string | null;
  mapLocation: {
    address: string;
  } | null;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LinkManagerProps {
  initialLinks: Link[];
  userId: string;
}

// SortableItem component
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

// Add this helper function
function getLinkIcon(type: string) {
  switch (type) {
    case "link":
      return <Link className='h-4 w-4' />;
    case "image":
      return <ImageIcon className='h-4 w-4' />;
    case "map":
      return <MapPin className='h-4 w-4' />;
    case "header":
      return <Heading className='h-4 w-4' />;
    default:
      return <Link className='h-4 w-4' />;
  }
}

// Add a new component for the link form
function LinkForm({ type, onSubmit }: { type: string; onSubmit: (data: FormData) => void }) {
  const [imageData, setImageData] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (type === "image" && imageData) {
      formData.set("image", imageData);
    }
    onSubmit(formData);
    e.currentTarget.reset(); // Reset form after submission
    setImageData(""); // Reset image data
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Common title field for all types */}
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input id='title' name='title' placeholder='Enter title' required />
      </div>

      {/* Type-specific fields */}
      {type === "link" && (
        <div className='space-y-2'>
          <Label htmlFor='url'>URL</Label>
          <Input id='url' name='url' type='url' placeholder='https://example.com' required />
        </div>
      )}

      {type === "image" && (
        <>
          <div className='space-y-2'>
            <Label>Image</Label>
            <ImageUpload value={imageData} onChange={setImageData} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='url'>Link URL (Optional)</Label>
            <Input id='url' name='url' type='url' placeholder='https://example.com' />
          </div>
        </>
      )}

      {type === "map" && (
        <div className='space-y-2'>
          <Label htmlFor='address'>Location Address</Label>
          <Input id='address' name='address' placeholder='Enter address' required />
          {/* We can add a map picker component here later */}
        </div>
      )}

      {type === "header" && (
        <div className='space-y-2'>
          <Label htmlFor='description'>Description (Optional)</Label>
          <Textarea id='description' name='description' placeholder='Add a description' />
        </div>
      )}

      <Button type='submit' className='w-full'>
        Add to List
      </Button>
    </form>
  );
}

// LinkManager component
export function LinkManager({ initialLinks, userId }: LinkManagerProps) {
  const { links, setLinks, addLink, removeLink, reorderLinks } = useDashboardStore();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Initialize store with initial links
  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks, setLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle adding a link
  function handleAddLink(formData: FormData) {
    try {
      const title = formData.get("title");
      if (!title || typeof title !== "string") throw new Error("Title is required");

      const data = {
        type: selectedType || "link",
        title,
        userId,
        url: formData.get("url") as string | null,
        image: formData.get("image") as string | null,
        description: formData.get("description") as string | null,
        mapLocation: selectedType === "map" ? { address: formData.get("address") as string } : null,
      };

      // Add to store
      addLink({
        ...data,
        id: crypto.randomUUID(),
        order: links.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setIsAddingLink(false);
    } catch (error) {
      console.error("Failed to add link:", error);
      toast.error("Failed to add link");
    }
  }

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(links, oldIndex, newIndex);
      const updatedLinks = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));

      reorderLinks(updatedLinks);
    }
  }

  return (
    <div className='space-y-6'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <SortableItem key={link.id} link={link} onDelete={removeLink} />
          ))}
        </SortableContext>
      </DndContext>

      <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
        <DialogTrigger asChild>
          <Button className='w-full' variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Choose Link Type</DialogTitle>
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
              <LinkForm
                type={selectedType}
                onSubmit={(data) => {
                  handleAddLink(data);
                  setShowForm(false);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
