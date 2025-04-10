import { Brain } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

const Navbar = async () => {
  return (
    <nav className="bg-background absolute top-0 left-0 w-full py-2 px-3 justify-between flex flex-row items-center z-30">
      <div className="size-6">
        <SidebarTrigger />
      </div>
      <div className="flex flex-row gap-2 items-center self-end">
        <Brain />
        <span className="text-sm font-medium ">Next.js Chatbot</span>
      </div>
    </nav>
  );
};

export default Navbar;
