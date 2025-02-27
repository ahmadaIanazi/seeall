import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 text-center'>
      <h1 className='text-4xl font-bold mb-4'>SeeAll.info - Simple Link Management</h1>
      <p className='text-lg mb-8 text-muted-foreground max-w-[600px]'>
        Create your personalized link page at seeall.info/
        <span className='font-mono font-bold'>username</span>
      </p>
      <div className='flex gap-4'>
        {session ? (
          <Link href='/dashboard' className={buttonVariants({ variant: "default" })}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href='/login' className={buttonVariants({ variant: "default" })}>
              Login
            </Link>
            <Link href='/register' className={buttonVariants({ variant: "outline" })}>
              Create Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
