import { auth } from "@/auth";
import { getChatsByUserId } from "@/lib/queries";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const chats = await getChatsByUserId(session.user.id);
  return Response.json(chats);
}
