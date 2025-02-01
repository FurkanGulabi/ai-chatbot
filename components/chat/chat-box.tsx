"use client";
import { ArrowUp, Image, Loader2, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ChatBox = ({ mode }: { mode: "new" | "continue" }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return toast.error("Please enter a message");
    }

    try {
      setIsLoading(true);
      // TODO: Implement API call to send message
      console.log("Sending message:", message);

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
          disabled={isLoading}
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
