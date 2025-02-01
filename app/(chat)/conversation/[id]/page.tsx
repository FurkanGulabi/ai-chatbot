import ChatBox from "@/components/chat/chat-box";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <main className="min-h-screen flex items-center py-8 px-5 justify-between flex-col w-full">
      <div className=" flex items-center justify-center overflow-scroll w-full max-w-5xl h-full">
        {params.id}
      </div>
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
