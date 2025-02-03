"use client";
import { ArrowUp, Image, Loader2, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ChatBox = ({ mode }: { mode: "new" | "continue" }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return toast.error("Please enter a message");
    }

    if (message.length > 1000) {
      return toast.error("Message must be less than 1000 characters");
    }

    try {
      setIsLoading(true);

      if (mode === "new") {
        const response = await fetch("/api/chat/new", {
          method: "POST",
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
        if (data.success) {
          router.replace(`/conversation/${data.conversationId}`);
        } else {
          toast.error("Failed to send message");
        }
        console.log(data);
      } else if (mode === "continue") {
        // TODO: Implement API call to continue conversation
        console.log("Continuing conversation:", message);
      }

      setMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full  gap-2 p-2 flex-col border rounded-2xl ${
        mode === "continue"
          ? "border-gray-700 max-w-3xl"
          : "border-gray-800 max-w-xl"
      }`}
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message to ai"
        disabled={isLoading}
        autoFocus
        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-400"
      />
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-2 p-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={isLoading}
          >
            <Paperclip className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled={isLoading}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="size-4" />
          </Button>
        </div>
        <Button
          variant="default"
          className="rounded-full"
          size="icon"
          type="submit"
          disabled={isLoading || !message.trim()}
          aria-label="Send message"
          aria-describedby="Send message to ai"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className="size-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChatBox;
