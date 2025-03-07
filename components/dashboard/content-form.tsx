"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUploadMulti } from "@/components/images/image-upload-multi";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { ContentType } from "@/types/content-type";
import { Link, Image as ImageIcon, Folder, Star, ShoppingCart, Users, File } from "lucide-react";

// Default icons for each content type
const DEFAULT_ICONS = {
  [ContentType.LINK]: <Link className='h-4 w-4' />,
  [ContentType.IMAGE]: <ImageIcon className='h-4 w-4' />,
  [ContentType.CATEGORY]: <Folder className='h-4 w-4' />,
  [ContentType.ICON]: <Star className='h-4 w-4' />,
  [ContentType.PRODUCT]: <ShoppingCart className='h-4 w-4' />,
  [ContentType.SOCIAL]: <Users className='h-4 w-4' />,
  [ContentType.BLANK]: <File className='h-4 w-4' />,
};

const URL = <Input name='url' type='url' placeholder='https://example.com' />;
const IMAGE = <ImageUploadMulti name='image' />;
const TITLE = <Input name='title' placeholder='Enter title' />;
const DESCRIPTION = <Textarea name='description' placeholder='Description...' />;
const ICON = <IconPicker triggerPlaceholder='Select Icon' />;
const PRICE = <Input name='price' type='number' step='0.01' placeholder='0.00' />;
const CURRENCY = <Input name='currency' placeholder='USD, EUR...' />;

/**
 * Renders the required field based on the selected content type.
 * Each content type has only one required field.
 */
function RequiredFields({ type }) {
  switch (type) {
    case ContentType.LINK:
      return <>{URL}</>;
    case ContentType.IMAGE:
      return <>{IMAGE}</>;
    case ContentType.CATEGORY:
    case ContentType.PRODUCT:
      return <>{TITLE}</>;
    case ContentType.ICON:
      return <>{ICON}</>;
    case ContentType.SOCIAL:
      return <>{URL}</>;
    case ContentType.BLANK:
      return null;
    default:
      return null;
  }
}

/**
 * Renders the primary optional fields based on the selected content type.
 * These fields appear immediately below the required fields.
 */
function PrimaryOptionalFields({ type }) {
  switch (type) {
    case ContentType.LINK:
      return <>{TITLE}</>;
    case ContentType.IMAGE:
    case ContentType.CATEGORY:
      return <>{DESCRIPTION}</>;
    case ContentType.ICON:
      return <>{TITLE}</>;
    case ContentType.PRODUCT:
      return (
        <>
          {PRICE}
          {CURRENCY}
          {DESCRIPTION}
          {IMAGE}
        </>
      );
    case ContentType.SOCIAL:
      return <>{ICON}</>;
    case ContentType.BLANK:
      return (
        <>
          {TITLE}
          {DESCRIPTION}
          {IMAGE}
        </>
      );
    default:
      return null;
  }
}

/**
 * Renders the secondary optional fields that appear when 'More Options' is enabled.
 * Excludes fields already used in Required or Primary Optional sections.
 */
function SecondaryOptionalFields({ type }) {
  const allOptions = [
    { key: "title", component: TITLE },
    { key: "url", component: URL },
    { key: "image", component: IMAGE },
    { key: "description", component: DESCRIPTION },
    { key: "icon", component: ICON },
    { key: "price", component: PRICE },
    { key: "currency", component: CURRENCY },
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
      <Textarea name='multiLanguage' placeholder='{"en":"Hello","es":"Hola"}' />
      <Label>Parent Content</Label>
      <Select>
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

/**
 * Main form component that dynamically renders fields based on content type.
 * Allows toggling secondary optional fields.
 */
export function ContentForm({ type, onSubmit }) {
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-h-96 overflow-y-auto'>
      <RequiredFields type={type} />
      <PrimaryOptionalFields type={type} />
      <Label>Icon</Label>
      <IconPicker name='icon' triggerPlaceholder='Select Icon' />
      <div className='flex items-center justify-between pt-2'>
        <Label className='text-sm'>More Options</Label>
        <Switch checked={showMore} onCheckedChange={setShowMore} />
      </div>
      {showMore && <SecondaryOptionalFields type={type} />}
      <Button type='submit'>Add</Button>
    </form>
  );
}
