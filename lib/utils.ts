import { Chat } from "@/prisma/generated";
import {
  CoreMessage,
  CoreToolMessage,
  generateObject,
  Message,
  ToolInvocation,
} from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { myProvider } from "./models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Message[];
}): Message[] {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}
export function convertToUIMessages(
  messages: Array<CoreMessage>
): Array<Message> {
  if (!Array.isArray(messages)) {
    return [];
  }
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: uuidv4(),
      role: message.role,
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}
interface ApplicationError extends Error {
  info: string;
  status: number;
}
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getTitleFromChat(chat: Chat) {
  const messages = convertToUIMessages(chat.messages as Array<CoreMessage>);
  const firstMessage = messages[0];

  if (!firstMessage) {
    return "Untitled";
  }

  return firstMessage.content;
}

export const generateTitleWithAi = async (messages: CoreMessage[]) => {
  const { object } = await generateObject({
    system: `"You are an AI assistant specialized in generating concise, meaningful titles for conversations on any topic.
     Create titles that summarize the conversation's main theme in 2-5 words, ensuring they fit within a small UI container (e.g., 20-25 characters or less).
      Avoid overly long or generic titles, and focus on clarity and relevance to the conversation's subject."`,

    prompt: JSON.stringify(messages),
    model: myProvider.languageModel("title-model"),
    schema: z.object({
      title: z.string(),
    }),
    output: "object",
  });

  return object.title;
};
