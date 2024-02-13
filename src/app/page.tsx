import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import {LogIn} from 'lucide-react'

export default async function Home() {
  const {userId} = auth();
  const isAuth = !!userId
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mg-8  text-5xl font-semibold">Chat with any PDF</h1>
            <div className="ml-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          <div className="flex my-6">
            {isAuth && <Button>Go to chats</Button>}
          </div>
            <p className="mt-2 text-slate-600 max-w-xl">
              Join millions of students, researchers, and professionals to answer questions and understand research using the power of AI.
            </p>

            <div className="w-full mt-4">
              {isAuth ? (<h1>fileupload component</h1>) : (
              <Link href='/sign-in'>
                <Button>
                  Login to get started
                  <LogIn className="w-6 h-6 ml-2" />
                </Button>
              </Link>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}