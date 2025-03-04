"use client";

import { Link } from "@prisma/client";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkListProps {
  links: Link[];
  alignment?: string | null;
}

interface MapLocation {
  address: string;
}

function HeaderLink({ title, alignment }: { title: string; alignment?: string | null }) {
  return (
    <h2
      className={cn("text-xl font-semibold my-6 first:mt-0", {
        "text-left": alignment === "left",
        "text-center": alignment === "center",
        "text-right": alignment === "right",
      })}
    >
      {title}
    </h2>
  );
}

function ImageLink({ title, image, url, alignment }: { title: string; image: string; url?: string; alignment?: string | null }) {
  const Component = url ? "a" : "div";
  const props = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Component {...props} className='block w-full overflow-hidden rounded-xl transition-transform hover:scale-[1.02] focus:scale-[1.02]'>
      <div className='relative aspect-[1.91/1] w-full'>
        <Image src={image} alt={title} fill className='object-cover' sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' />
      </div>
      {title && (
        <p
          className={cn("mt-2 text-sm text-muted-foreground", {
            "text-left": alignment === "left",
            "text-center": alignment === "center",
            "text-right": alignment === "right",
          })}
        >
          {title}
        </p>
      )}
    </Component>
  );
}

function MapLink({ title, mapLocation, alignment }: { title: string; mapLocation: MapLocation | null; alignment?: string | null }) {
  if (!mapLocation) return null;

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation.address)}`}
      target='_blank'
      rel='noopener noreferrer'
      className='block w-full rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent'
    >
      <div
        className={cn("flex items-center gap-3", {
          "justify-start": alignment === "left",
          "justify-center": alignment === "center",
          "justify-end": alignment === "right",
        })}
      >
        <MapPin className='h-5 w-5 shrink-0 text-muted-foreground' />
        <div className='flex-1 overflow-hidden'>
          <p
            className={cn("truncate font-medium", {
              "text-left": alignment === "left",
              "text-center": alignment === "center",
              "text-right": alignment === "right",
            })}
          >
            {title}
          </p>
          <p
            className={cn("truncate text-sm text-muted-foreground", {
              "text-left": alignment === "left",
              "text-center": alignment === "center",
              "text-right": alignment === "right",
            })}
          >
            {mapLocation.address}
          </p>
        </div>
      </div>
    </a>
  );
}

function StandardLink({ title, url, alignment }: { title: string; url: string; alignment?: string | null }) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={cn("block w-full rounded-lg border bg-card p-4 font-medium shadow-sm transition-colors hover:bg-accent", {
        "text-left": alignment === "left",
        "text-center": alignment === "center",
        "text-right": alignment === "right",
      })}
    >
      {title}
    </a>
  );
}

export function LinkList({ links, alignment = "center" }: LinkListProps) {
  if (!links?.length) {
    return <div className='text-center text-muted-foreground py-8'>No links added yet</div>;
  }

  console.log("~======== LINKS:", links);
  return (
    <div className='space-y-4'>
      {links.map((link) => {
        switch (link.type) {
          case "header":
            return <HeaderLink key={link.id} title={link.title} alignment={alignment} />;
          case "image":
            return link.image ? <ImageLink key={link.id} title={link.title} image={link.image} url={link.url} alignment={alignment} /> : null;
          case "map":
            return <MapLink key={link.id} title={link.title} mapLocation={link.mapLocation as MapLocation} alignment={alignment} />;
          default:
            return link.url ? <StandardLink key={link.id} title={link.title} url={link.url} alignment={alignment} /> : null;
        }
      })}
    </div>
  );
}
