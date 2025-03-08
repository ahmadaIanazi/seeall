"use client";
import { ImageUploadMulti } from "@/components/images/image-upload-multi";
import { Button } from "@/components/ui/button";
import { IconName, IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardStore } from "@/lib/store/dashboard";
import { ContentType } from "@/types/content-type";
import { useState } from "react";

const URLInput = (v) => <Input name='url' type='url' placeholder='https://example.com' defaultValue={v?.url || ""} />;
const IMAGEInput = (v) => <ImageUploadMulti name='image' defaultValue={v?.image ? [v.image] : []} />;
const TITLEInput = (v) => <Input name='title' defaultValue={v?.title || ""} placeholder='Enter title' />;
const DESCRIPTIONInput = (v) => <Textarea name='description' defaultValue={v?.description || ""} placeholder='Description...' />;
const ICONInput = (v, value, onValueChange) => <IconPicker name='icon' triggerPlaceholder='Select Icon' value={value} onValueChange={onValueChange} />;
const PRICEInput = (v) => <Input name='price' type='number' step='0.01' defaultValue={v?.price || ""} placeholder='0.00' />;
const CURRENCYInput = (v) => <Input name='currency' defaultValue={v?.currency || ""} placeholder='USD, EUR...' />;

function RequiredFields({ type, currentContent }) {
  switch (type) {
    case ContentType.LINK:
      return <>{URLInput(currentContent)}</>;
    case ContentType.IMAGE:
      return <>{IMAGEInput(currentContent)}</>;
    case ContentType.CATEGORY:
    case ContentType.PRODUCT:
      return <>{TITLEInput(currentContent)}</>;
    case ContentType.ICON:
      return <>{ICONInput(currentContent)}</>;
    case ContentType.SOCIAL:
      return <>{URLInput(currentContent)}</>;
    case ContentType.BLANK:
    default:
      return null;
  }
}

function PrimaryOptionalFields({ type, currentContent }) {
  switch (type) {
    case ContentType.LINK:
      return <>{TITLEInput(currentContent)}</>;
    case ContentType.IMAGE:
    case ContentType.CATEGORY:
      return <>{DESCRIPTIONInput(currentContent)}</>;
    case ContentType.ICON:
      return <>{TITLEInput(currentContent)}</>;
    case ContentType.PRODUCT:
      return (
        <>
          {PRICEInput(currentContent)}
          {CURRENCYInput(currentContent)}
          {DESCRIPTIONInput(currentContent)}
          {IMAGEInput(currentContent)}
        </>
      );
    case ContentType.SOCIAL:
      return <>{ICONInput(currentContent)}</>;
    case ContentType.BLANK:
      return (
        <>
          {TITLEInput(currentContent)}
          {DESCRIPTIONInput(currentContent)}
          {IMAGEInput(currentContent)}
        </>
      );
    default:
      return null;
  }
}

function SecondaryOptionalFields({ type, currentContent }) {
  const allOptions = [
    { key: "title", component: TITLEInput(currentContent) },
    { key: "url", component: URLInput(currentContent) },
    { key: "image", component: IMAGEInput(currentContent) },
    { key: "description", component: DESCRIPTIONInput(currentContent) },
    { key: "icon", component: ICONInput(currentContent) },
    { key: "price", component: PRICEInput(currentContent) },
    { key: "currency", component: CURRENCYInput(currentContent) },
  ];
  const usedOptions = new Set();
  switch (type) {
    case ContentType.LINK:
      usedOptions.add("url").add("title");
      break;
    case ContentType.IMAGE:
      usedOptions.add("image").add("description");
      break;
    case ContentType.CATEGORY:
      usedOptions.add("title").add("description");
      break;
    case ContentType.ICON:
      usedOptions.add("icon").add("title");
      break;
    case ContentType.PRODUCT:
      usedOptions.add("title").add("price").add("currency").add("description").add("image");
      break;
    case ContentType.SOCIAL:
      usedOptions.add("url").add("icon");
      break;
    case ContentType.BLANK:
      usedOptions.add("title").add("description").add("image");
      break;
    default:
      break;
  }
  return (
    <>
      {allOptions
        .filter(({ key }) => !usedOptions.has(key))
        .map(({ key, component }) => (
          <div key={key}>{component}</div>
        ))}
      <Label>Multi Language (JSON)</Label>
      <Textarea name='multiLanguage' defaultValue={currentContent?.multiLanguage ? JSON.stringify(currentContent.multiLanguage) : ""} placeholder='{"en":"Hello","es":"Hola"}' />
      <Label>Parent Content</Label>
      <Select defaultValue={currentContent?.parentContentId || "none"} name='parentContentId'>
        <SelectTrigger>
          <SelectValue placeholder='No Parent' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>No Parent</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

export function ContentForm({ type, onSubmit }) {
  const { currentContent } = useDashboardStore();
  const isEditing = !!currentContent;
  const [showMore, setShowMore] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(currentContent?.icon || "Star");
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-h-96 overflow-y-auto'>
      <RequiredFields type={type} currentContent={currentContent} />
      <PrimaryOptionalFields type={type} currentContent={currentContent} />
      <Label>Icon</Label>
      {ICONInput(currentContent, selectedIcon, setSelectedIcon)}
      <input type='hidden' name='icon' value={selectedIcon || ""} />
      <div className='flex items-center justify-between pt-2'>
        <Label className='text-sm'>More Options</Label>
        <Switch checked={showMore} onCheckedChange={setShowMore} />
      </div>
      {showMore && <SecondaryOptionalFields type={type} currentContent={currentContent} />}
      <Button type='submit'>{isEditing ? "Save" : "Add"}</Button>
    </form>
  );
}
