"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ConversationToaster() {
  const searchParams = useSearchParams();
  console.log(searchParams);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "conversation_not_found") {
      toast.error("Conversation not found", {
        duration: 5000,
        position: "top-center",
      });

      const timer = setTimeout(() => {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.search = "";
        window.history.replaceState({}, "", cleanUrl.toString());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return null;
}
