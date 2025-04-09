import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById } from "@/lib/queries";
import { convertToUIMessages } from "@/lib/utils";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return notFound();
  }
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  const chat = convertToUIMessages(chatFromDb.messages);
  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chatFromDb.userId) {
    return notFound();
  }

  return <PreviewChat id={chatFromDb.id} initialMessages={chat} />;
}
