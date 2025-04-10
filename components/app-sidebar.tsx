import { auth } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Loader2, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import History from "./history";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger isSidebar={true} />
        <Button asChild variant={"outline"}>
          <Link href={"/"}>
            <Plus />
            New Chat
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarContent className="grow h-full items-center justify-center">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <History session={session} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
