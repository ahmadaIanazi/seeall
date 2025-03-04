"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDashboardStore } from "@/lib/store/dashboard";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@prisma/client";
import { GripVertical, Heading, Image as ImageIcon, Link as LinkIcon, MapPin, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LinkTypeSelector } from "./link-type-selector";

function getLinkIcon(type: string) {
  if (type === "link") return <LinkIcon className='h-4 w-4' />;
  if (type === "image") return <ImageIcon className='h-4 w-4' />;
  if (type === "map") return <MapPin className='h-4 w-4' />;
  if (type === "header") return <Heading className='h-4 w-4' />;
  return <LinkIcon className='h-4 w-4' />;
}

function SortableItem({ link, onDelete }: { link: Link; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
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

export function PageContentManager({ pageId }: { pageId: string }) {
  const { links, setLinks, addLink, removeLink, reorderLinks } = useDashboardStore();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch(`/api/links/${pageId}`);
        if (!res.ok) throw new Error("Failed to fetch links");
        const data: Link[] = await res.json();
        setLinks(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLinks();
  }, [pageId, setLinks]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function handleAddLink(formData: FormData) {
    const title = formData.get("title") as string;
    if (!title) return;
    addLink({
      id: crypto.randomUUID(),
      type: selectedType || "link",
      title,
      url: (formData.get("url") as string) || null,
      image: (formData.get("image") as string) || null,
      description: null,
      order: links.length,
      pageId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setShowForm(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((i) => i.id === active.id);
      const newIndex = links.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(links, oldIndex, newIndex).map((item, index) => ({ ...item, order: index }));
      reorderLinks(reordered);
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

      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Add {selectedType?.charAt(0).toUpperCase() + selectedType?.slice(1)}</SheetTitle>
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
                <Button type='submit'>Add</Button>
              </form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
