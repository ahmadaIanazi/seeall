"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { useDashboardStore } from "@/lib/store/dashboard";
import { toast } from "sonner";
import { ExternalLinkIcon, EyeIcon, Loader2, LogOutIcon } from "lucide-react";
import { useState } from "react";

interface DashboardNavProps {
  user: User;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { hasUnsavedChanges, saveChanges } = useDashboardStore();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveChanges();
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

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
          {hasUnsavedChanges && (
            <Button onClick={handleSave} disabled={isSaving} className='gap-2'>
              {isSaving && <Loader2 className='h-4 w-4 animate-spin' />}
              Save Changes
            </Button>
          )}
          <Button variant='outline' onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOutIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
