"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthProviders } from "@/types/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";
import { signInWithEmail, signInWithProvider } from "../actions/auth";

export const formSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setIsEmailLoading(true);
    const data = await signInWithEmail(values);
    if (!data?.success && !data?.message) {
      toast.error("Something went wrong");
    } else if (data?.success) {
      toast.success(data?.message);
    } else if (!data?.success) {
      toast.error(data?.message);
    }

    setIsEmailLoading(false);
    setIsLoading(false);
  };

  const handleProviderSignIn = async (provider: AuthProviders) => {
    setIsLoading(true);
    if (provider === AuthProviders.Google) {
      setIsGoogleLoading(true);
    } else if (provider === AuthProviders.GitHub) {
      setIsGithubLoading(true);
    }
    const { success, message } = await signInWithProvider(provider);
    if (!success && !message) {
      toast.error("Something went wrong");
    } else if (success) {
      toast.success(message);
    }
    setIsLoading(false);
    if (provider === AuthProviders.Google) {
      setIsGoogleLoading(false);
    } else if (provider === AuthProviders.GitHub) {
      setIsGithubLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <main className="flex items-center justify-center  min-h-screen">
      <div className="wrapper w-full max-w-md flex-col gap-6 flex justify-center">
        <h1 className="text-center font-bold text-2xl">Sign in to contiune</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailSignIn)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="me@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isEmailLoading || isLoading}>
              {isEmailLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              <span>Continue with Email</span>
            </Button>
          </form>
        </Form>

        {/* ---- OR ----  text*/}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">OR</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-4">
          <Button
            variant={"outline"}
            onClick={() => handleProviderSignIn(AuthProviders.Google)}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FaGoogle className="w-4 h-4 mr-2" />
            )}
            <span>Continue with Google</span>
          </Button>
          <Button
            variant={"outline"}
            onClick={() => handleProviderSignIn(AuthProviders.GitHub)}
            disabled={isGithubLoading || isLoading}
          >
            {isGithubLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FaGithub className="w-4 h-4 mr-2" />
            )}
            <span>Continue with Github</span>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
