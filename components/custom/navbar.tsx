import { auth } from "@/auth";
import { Brain } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { ModeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = async () => {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });
  return (
    <nav className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
      <span>Placeholder</span>
      <div className="flex flex-row gap-2 items-center">
        <Brain />
        <span className="text-sm font-medium">Next.js Chatbot</span>
      </div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="py-1.5 px-2 h-fit font-normal"
              variant="secondary"
            >
              {session.user?.email}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <ModeToggle />
            </DropdownMenuItem>
            <DropdownMenuItem className="p-1 z-50">
              <form
                className="w-full"
                action={async () => {
                  "use server";

                  await auth.api.signOut({
                    headers: headerList,
                  });
                }}
              >
                <button
                  type="submit"
                  className="w-full text-left px-1 py-0.5 text-red-500"
                >
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="py-1.5 px-2 h-fit font-normal text-white" asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
