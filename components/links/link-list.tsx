"use client";

import { Link } from "@prisma/client";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface LinkListProps {
  links: Link[];
}

function HeaderLink({ title }: { title: string }) {
  return <h2 className='text-xl font-semibold text-center my-6 first:mt-0'>{title}</h2>;
}

function ImageLink({ title, image, url }: { title: string; image: string; url?: string }) {
  const Component = url ? "a" : "div";
  const props = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Component {...props} className='w-full overflow-hidden rounded-xl transition-transform hover:scale-[1.02] focus:scale-[1.02]'>
      <div className='relative aspect-[1.91/1] w-full'>
        <Image src={image} alt={title} fill className='object-cover' sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' />
      </div>
      {title && <p className='mt-2 text-sm text-muted-foreground'>{title}</p>}
    </Component>
  );
}

function MapLink({ title, mapLocation }: { title: string; mapLocation: any }) {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation.address)}`}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent'
    >
      <MapPin className='h-5 w-5 shrink-0 text-muted-foreground' />
      <div className='flex-1 overflow-hidden'>
        <p className='truncate font-medium'>{title}</p>
        <p className='truncate text-sm text-muted-foreground'>{mapLocation.address}</p>
      </div>
    </a>
  );
}

function StandardLink({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center justify-center rounded-lg border bg-card p-4 text-center font-medium shadow-sm transition-colors hover:bg-accent'
    >
      {title}
    </a>
  );
}

export function LinkList({ links }: LinkListProps) {
  if (!links?.length) {
    return <div className='text-center text-muted-foreground py-8'>No links added yet</div>;
  }

  return (
    <div className='space-y-4'>
      {links.map((link) => {
        switch (link.type) {
          case "header":
            return <HeaderLink key={link.id} title={link.title} />;

          case "image":
            return <ImageLink key={link.id} title={link.title} image={link.image!} url={link.url} />;

          case "map":
            return <MapLink key={link.id} title={link.title} mapLocation={link.mapLocation} />;

          default:
            return <StandardLink key={link.id} title={link.title} url={link.url!} />;
        }
      })}
    </div>
  );
}
