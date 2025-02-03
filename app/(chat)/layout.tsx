import { AppSidebar } from "@/components/app-sidebar";
import { ConversationToaster } from "@/components/global/conversation-toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <ConversationToaster />
        <Toaster />
        <SidebarTrigger className="fixed top-2 left-50 z-10" />
        {children}
      </main>
    </SidebarProvider>
  );
}
