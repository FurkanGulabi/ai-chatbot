import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/custom/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
