"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error(response?.error || "Something went wrong");
    }

    router.refresh();
    router.push("/dashboard");
    toast.success("Logged in successfully");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your username and password to access your links</CardDescription>
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
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
        <p className='text-center text-sm text-muted-foreground mt-4'>
          Don't have an account?{" "}
          <Link href='/register' className='text-primary hover:underline'>
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
