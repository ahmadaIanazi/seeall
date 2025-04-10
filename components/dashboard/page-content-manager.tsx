"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useDashboardStore } from "@/lib/store/dashboard";
import { ContentType } from "@/types/content-type";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Content } from "@prisma/client";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ContentForm } from "./content-form";
import { ContentSortableItem } from "./content-sortable-items";
import { ContentTypeSelector } from "./content-type-selector";

export function PageContentManager({ pageId }: { pageId: string }) {
  const { contents, setContents, edit, addContent, removeContent, reorderContents, currentContent, setCurrentContent, updateContent, toggleContentVisibility } =
    useDashboardStore();
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchContents() {
      try {
        const res = await fetch(`/api/contents/${pageId}`);
        if (!res.ok) throw new Error("Failed to fetch contents");
        const data: Content[] = await res.json();
        setContents(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchContents();
  }, [pageId, setContents]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function handleAddContent(formData: FormData) {
    let parentContentId = formData.get("parentContentId") as string;
    if (parentContentId === "none") parentContentId = "";

    const newItem = {
      id: currentContent?.id ? currentContent.id : crypto.randomUUID(),
      type: selectedType || ContentType.BLANK,
      title: (formData.get("title") as string) || null,
      url: (formData.get("url") as string) || null,
      // image: (formData.get("image") as string) || null,
      icon: (formData.get("icon") as string) || null,
      description: (formData.get("description") as string) || null,
      name: (formData.get("name") as string) || null,
      currency: (formData.get("currency") as string) || null,
      parentContentId: parentContentId || null,
      visible: currentContent?.visible ? currentContent.visible : true,
      anchor: selectedType === ContentType.CATEGORY ? true : false,
      pageId,
      createdAt: currentContent?.createdAt ? currentContent.createdAt : new Date(),
      updatedAt: new Date(),
    } as Content;

    // Handle image field - should be an array of objects with { src, id }
    const image = formData.get("image");
    if (image) {
      try {
        // If it's a string, try to parse it as JSON
        if (typeof image === "string") {
          // Check if it's already in JSON format
          if (image.startsWith("[") || image.startsWith("{")) {
            newItem.image = JSON.parse(image);
          } else {
            // It's likely a single data URL, so create an array with one object
            newItem.image = [
              {
                src: image,
                id: crypto.randomUUID(),
              },
            ];
          }
        } else {
          // If it's a File object from a form upload
          const file = image as File;
          // You'll need to handle file upload and get the URL
          // This is placeholder logic - implement your actual file handling
          newItem.image = [
            {
              src: URL.createObjectURL(file), // Replace with your actual file upload logic
              id: crypto.randomUUID(),
            },
          ];
        }
      } catch (error) {
        console.error("Error handling image data:", error);
        // Fallback to an empty array as specified
        newItem.image = [];
      }
    } else if (currentContent?.image) {
      // Preserve existing images if we're updating
      newItem.image = currentContent.image;
    } else {
      // Default to empty array for new content
      newItem.image = [];
    }
    const price = formData.get("price");
    if (price) newItem.price = parseFloat(price as string);

    const multiLanguage = formData.get("multiLanguage");
    if (multiLanguage) {
      try {
        newItem.multiLanguage = JSON.parse(multiLanguage as string);
      } catch {
        newItem.multiLanguage = {};
      }
    }

    if (currentContent) {
      updateContent(newItem);
    } else {
      addContent(newItem);
    }
    setShowForm(false);
    setCurrentContent(null);
  }

  function handleOnContentEdit(content) {
    setIsAddingContent(false);
    setSelectedType(content.type);
    setShowForm(true);
    setCurrentContent(content);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = contents.findIndex((i) => i.id === active.id);
      const newIndex = contents.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(contents, oldIndex, newIndex).map((item, index) => ({ ...item, order: index }));
      reorderContents(reordered);
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={contents.map((content) => content.id)} strategy={verticalListSortingStrategy}>
          {contents.map((content) => (
            <ContentSortableItem
              key={content.id}
              content={content}
              editing={edit}
              onDelete={removeContent}
              toggleVisibility={toggleContentVisibility}
              onEdit={handleOnContentEdit}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Sheet open={isAddingContent} onOpenChange={setIsAddingContent}>
        <SheetTrigger asChild>
          {edit && (
            <Button className='w-full' variant='outline'>
              <Plus className='mr-2 h-4 w-4' />
              Add New
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side='bottom' className='max-h-[80vh]'>
          <SheetHeader>
            <SheetTitle>Choose Content Type</SheetTitle>
          </SheetHeader>
          <div className='overflow-y-auto max-h-[calc(80vh-80px)] pb-6'>
            <ContentTypeSelector
              onSelect={(type) => {
                setSelectedType(type);
                setIsAddingContent(false);
                setShowForm(true);
              }}
              onClose={() => setIsAddingContent(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Add {selectedType?.charAt(0).toUpperCase() + selectedType?.slice(1).toLowerCase()}</SheetTitle>
          </SheetHeader>
          <div className='p-6'>{selectedType && <ContentForm type={selectedType} onSubmit={handleAddContent} possibleParents={contents} />}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
