import { Chat } from "@/components/custom/chat";
import { v4 } from "uuid";

export default async function Page() {
  const id = v4();
  return <Chat id={id} initialMessages={[]} />;
}
