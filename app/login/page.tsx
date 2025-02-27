import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
