"use client";

import { fetcher } from "@/lib/utils";
import { Chat } from "@/prisma/generated";
import { Session, User } from "better-auth";
import { cx } from "class-variance-authority";
import {
  CircleAlert,
  Loader2,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HistoryProps {
  session: { session: Session; user: User } | null;
}

const History = ({ session }: HistoryProps) => {
  const { id } = useParams();
  const pathname = usePathname();

  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>(session ? "/api/history" : null, fetcher, {
    fallbackData: [],
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting...",
      success: () => {
        mutate((history) => {
          if (history) {
            return history.filter((chat) => chat.id !== deleteId);
          }
          return history;
        });
        return "Chat deleted successfully.";
      },
      error: "Error deleting chat.",
    });

    setShowDeleteDialog(false);
  };

  useEffect(() => {
    mutate();
    console.log(history);
  }, [pathname, mutate, history]);

  if (isLoading) {
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>;
  }

  if (!session) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex gap-2 text-muted-foreground text-sm items-center">
          <CircleAlert className="size-4" />
          <span>Login to save previous chats!</span>
        </div>
      </div>
    );
  }

  if (session && history?.length === 0) {
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-2 text-muted-foreground text-sm items-center">
        <CircleAlert className="size-4" />
        <span>No chats found</span>
      </div>
    </div>;
  }

  if (history) {
    return (
      <>
        <div className="flex flex-col overflow-y-scroll h-full w-full scroll-smooth no-scrollbar p-2">
          {history.map((chat) => (
            <div
              key={chat.id}
              className={cx(
                "flex flex-row items-center gap-4 hover:bg-secondary/80 rounded-lg transition-colors duration-200 w-full max-w-full",
                { "bg-secondary": chat.id === id }
              )}
            >
              <Button
                variant="ghost"
                className={cx(
                  "grow justify-between !outline-none focus:!outline-none !bg-transparent  p-0 text-sm font-normal flex flex-row items-center gap-2 transition-none text-secondary-foreground "
                )}
                asChild
              >
                <Link
                  href={`/chat/${chat.id}`}
                  className="text-ellipsis overflow-hidden whitespace-nowrap py-3 px-4 text-left rounded-lg !truncate w-40 "
                >
                  {chat.title ?? "Untitled"}
                </Link>
              </Button>

              <DropdownMenu modal={true}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer hover:!bg-secondary/80 text-secondary-foreground"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="left"
                  className="z-[60] bg-background border border-border rounded-md shadow-lg"
                >
                  <DropdownMenuItem asChild>
                    <Button
                      className="w-full h-fit font-normal p-2 rounded-sm flex flex-row gap-2 items-center justify-start text-secondary-foreground hover:bg-destructive/10"
                      variant="ghost"
                      onClick={() => {
                        setDeleteId(chat.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <div>Delete</div>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-background border border-border rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-foreground">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete your
                chat and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default History;
