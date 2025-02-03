import { auth } from "@/auth";
import ChatBox from "@/components/chat/chat-box";
import MessageContainer from "@/components/chat/message-container";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: true },
  });

  if (!conversation || conversation.userId !== session.user.id) {
    redirect("/?error=conversation_not_found");
  }

  return (
    <main className="min-h-screen flex items-center  px-5 justify-between flex-col w-full">
      <MessageContainer />
      <Suspense fallback={<Skeleton className="w-full max-w-xl h-32" />}>
        <div className="flex flex-col gap-2 w-full items-center max-w-5xl">
          <ChatBox mode="continue" />
          <p className="text-muted-foreground text-sm">
            The text is AI generated. Do not trust
          </p>
        </div>
      </Suspense>
    </main>
  );
};

export default page;
