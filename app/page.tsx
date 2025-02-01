import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">Auth Test Page</h1>

      {session ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">Signed in as: {session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button>Sign Out</Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button className="w-full">
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Sign In with Google
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <Button variant="outline" className="w-full">
              <Github className="w-5 h-5" />
              Sign In with GitHub
            </Button>
          </form>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
      </div>
    </main>
  );
}
