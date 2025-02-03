"use client";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MessageProps {
  message: string;
  role: "user" | "assistant";
}

const Message = ({ message, role }: MessageProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy message", error);
      toast.error("Failed to copy message");
    }
  };

  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-2 group",
        isUser ? "justify-end mb-10" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="mt-1">
          <AvatarImage src="" /> {/* Add default avatar image */}
          <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
        </Avatar>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={copyToClipboard}
        onKeyDown={(e) => e.key === "Enter" && copyToClipboard()}
        aria-label="Copy message to clipboard"
        className={cn(
          "p-3 shadow-md rounded-md break-words w-fit max-w-[85%] relative",
          "transition-all hover:scale-[99%] cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          isUser ? "bg-indigo-400 text-white" : "bg-muted text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        <span
          className={cn(
            "absolute -bottom-5 text-xs opacity-0 group-hover:opacity-60 transition-opacity whitespace-nowrap",
            isUser ? "right-2" : "left-2"
          )}
        >
          Click to copy
        </span>
      </div>
    </div>
  );
};

export default Message;
