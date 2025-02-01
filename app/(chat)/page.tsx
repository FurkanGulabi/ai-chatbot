import ChatBox from "@/components/chat/chat-box";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

const HomePage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col w-full">
      <Suspense fallback={<Skeleton className="w-full max-w-xl h-32" />}>
        <ChatBox mode="new" />
      </Suspense>
    </main>
  );
};

export default HomePage;
