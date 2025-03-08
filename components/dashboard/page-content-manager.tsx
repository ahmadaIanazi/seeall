"use client";
import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { Content } from "@prisma/client";
import { useDashboardStore } from "@/lib/store/dashboard";
import { ContentTypeSelector } from "./content-type-selector";
import { ContentType } from "@/types/content-type";
import { ContentForm } from "./content-form";
import { ContentSortableItem } from "./content-sortable-items";

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
      image: (formData.get("image") as string) || null,
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
              publicMode={!edit}
              onDelete={removeContent}
              toggleVisibility={toggleContentVisibility}
              onEdit={handleOnContentEdit}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
        <DialogTrigger asChild>
          {edit && (
            <Button className='w-full' variant='outline'>
              <Plus className='mr-2 h-4 w-4' />
              Add New
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Choose Content Type</DialogTitle>
          <ContentTypeSelector
            onSelect={(type) => {
              setSelectedType(type);
              setIsAddingContent(false);
              setShowForm(true);
            }}
            onClose={() => setIsAddingContent(false)}
          />
        </DialogContent>
      </Dialog>

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
