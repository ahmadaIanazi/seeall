"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      const error = await response.json();
      return toast.error(error.message || "Something went wrong");
    }

    toast.success("Account created successfully");
    router.push("/login");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Choose your username and password to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input id='username' name='username' placeholder='johndoe' required disabled={isLoading} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' required disabled={isLoading} />
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <p className='text-center text-sm text-muted-foreground mt-4'>
          Already have an account?{" "}
          <Link href='/login' className='text-primary hover:underline'>
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
