"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "@prisma/client";
import { GripVertical, Trash2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { LinkList } from "@/components/links/link-list";

interface LinkManagerProps {
  initialLinks: Link[];
  userId: string;
}

function SortableLink({ link, onDelete }: { link: Link; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: link.id,
  });

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
        <p className='font-medium truncate'>{link.title}</p>
        <p className='text-sm text-muted-foreground truncate'>{link.url}</p>
      </div>
      <Button variant='ghost' size='icon' onClick={() => onDelete(link.id)}>
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

export function LinkManager({ initialLinks, userId }: LinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function onAddLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        url,
        userId,
      }),
    });

    if (!response?.ok) {
      setIsLoading(false);
      const error = await response.json();
      return toast.error(error.message || "Something went wrong");
    }

    const newLink = await response.json();
    setLinks([...links, newLink]);
    setIsLoading(false);
    setTitle("");
    setUrl("");
    toast.success("Link added successfully");
  }

  async function onDeleteLink(id: string) {
    const response = await fetch(`/api/links/${id}`, {
      method: "DELETE",
    });

    if (!response?.ok) {
      const error = await response.json();
      return toast.error(error.message || "Something went wrong");
    }

    setLinks(links.filter((link) => link.id !== id));
    toast.success("Link deleted successfully");
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        const updatedLinks = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        // Update the order in the database
        fetch("/api/links/reorder", {
          method: "PUT",
          body: JSON.stringify({
            links: updatedLinks,
          }),
        }).catch((error) => {
          console.error("Failed to update link order:", error);
          toast.error("Failed to update link order");
        });

        return updatedLinks;
      });
    }
  }

  return (
    <div className='space-y-6'>
      <form onSubmit={onAddLink} className='space-y-4'>
        <div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Link Title' required disabled={isLoading} />
        </div>
        <div>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder='https://example.com' type='url' required disabled={isLoading} />
        </div>
        <Button type='submit' disabled={isLoading} className='w-full'>
          {isLoading ? "Adding..." : "Add Link"}
        </Button>
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links} strategy={verticalListSortingStrategy}>
          <LinkList
            links={links}
            isEditing={true}
            onDelete={onDeleteLink}
            dragHandleProps={
              <div className='cursor-move'>
                <GripVertical className='h-5 w-5 text-muted-foreground' />
              </div>
            }
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}
