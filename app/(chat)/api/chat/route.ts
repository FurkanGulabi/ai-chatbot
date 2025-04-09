"use server";

import { auth } from "@/auth";
import { deleteChatById, getChatById, saveChat } from "@/lib/queries";
import { google } from "@ai-sdk/google";
import { convertToCoreMessages, Message, streamText } from "ai";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Message[] } =
    await request.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const result = await streamText({
    model: google("gemini-2.0-flash-001"),
    messages: coreMessages,
    onFinish: async ({ response }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...response.messages],
            userId: session.user.id,
          });
          console.log("Chat saved successfully");
        } catch (error) {
          console.error("Failed to save chat", error);
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });
  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });
    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    if (chat?.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
