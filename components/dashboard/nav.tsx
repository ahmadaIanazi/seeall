"use client";

import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, LogOutIcon } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  return (
    <header className='border-b'>
      <div className='container max-w-7xl mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex gap-6 items-center'>
          <Link href='/dashboard' className='font-semibold'>
            Edit
          </Link>
          <Link href={`/${user.username}`} className='flex flex-row items-center space-x-1 text-sm text-muted-foreground hover:text-primary' target='_blank'>
            <p className='text-sm text-muted-foreground hover:text-primary'>/{user.username}</p>
            <ExternalLinkIcon className='size-3' />
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <Button variant='outline' onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOutIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
