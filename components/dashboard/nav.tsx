"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  return (
    <header className='border-b'>
      <div className='container max-w-7xl mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex gap-6 items-center'>
          <Link href='/dashboard' className='font-semibold'>
            Dashboard
          </Link>
          <Link href={`/${user.username}`} className='text-sm text-muted-foreground hover:text-primary' target='_blank'>
            View Public Page
          </Link>
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-sm text-muted-foreground'>@{user.username}</p>
          <Button variant='outline' onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
