"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const newConversationId = uuidv4();

    // Create conversation and message in a transaction
    const [conversation, createdMessage] = await prisma.$transaction([
      prisma.conversation.create({
        data: {
          id: newConversationId,
          userId: session.user.id,
        },
      }),
      prisma.message.create({
        data: {
          content: message,
          role: "user", // Assuming message role
          conversationId: newConversationId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      message: createdMessage,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
