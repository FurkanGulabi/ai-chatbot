import { auth } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { authRoute } from "@/routes";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { SidebarUser } from "./sidebar/sidebar-user";
import { Button } from "./ui/button";

export async function AppSidebar() {
  const session = await auth();
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <Button className="w-full">
            <MessageSquarePlus className="size-4 mr-2" />
            <span className="hidden md:block">New Chat</span>
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {session?.user ? (
          <SidebarUser
            name={session.user?.name ?? ""}
            email={session.user?.email ?? ""}
            avatar={session.user?.image ?? ""}
          />
        ) : (
          <Link href={authRoute}>
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
