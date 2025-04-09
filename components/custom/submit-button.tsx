"use client";

import { useFormStatus } from "react-dom";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative text-white"
    >
      {children}
      {pending && (
        <span className="animate-spin absolute right-4">
          <Loader2 />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </Button>
  );
}
