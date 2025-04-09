import { User } from "@/prisma/generated";
import "server-only";

import { CoreMessage } from "ai";
import { prisma } from "./prisma";

export async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
export async function getChatById({ id }: { id: string }) {
  try {
    const selectedChat = await prisma.chat.findUnique({
      where: { id },
    });
    if (selectedChat && typeof selectedChat.messages === "string") {
      return {
        ...selectedChat,
        messages: JSON.parse(selectedChat.messages),
      };
    }
    return selectedChat; // Returns null if not found, or chat with unparsed messages
  } catch (error) {
    console.error("Failed to get chat by id from database", error);
    throw error;
  }
}
export async function deleteChatById({ id }: { id: string }) {
  try {
    return await prisma.chat.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Failed to delete chat by id from database", error);
    throw error;
  }
}
export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: CoreMessage[];
  userId: string;
}) {
  try {
    const selectedChat = await prisma.chat.findFirst({
      where: {
        id,
      },
    });

    if (selectedChat) {
      return await prisma.chat.update({
        where: {
          id,
        },
        data: {
          messages: JSON.stringify(messages),
        },
      });
    }
    return await prisma.chat.create({
      data: {
        id,
        messages: JSON.stringify(messages),
        createdAt: new Date(),
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Failed to save chat to database", error);
    throw error;
  }
}
