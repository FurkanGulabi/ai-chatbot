"use server";

import { signOut as authSignOut, signIn } from "@/auth";
import { AuthProviders } from "@/types/providers";
import { z } from "zod";
import { formSchema } from "../auth/page";

async function signInWithEmail(values: z.infer<typeof formSchema>) {
  const { email } = values;
  if (!email) {
    return { success: false, message: "Email is required" };
  }
  console.log(email);

  return { success: true, message: "Not implemented" };
}

async function signInWithProvider(provider: AuthProviders) {
  if (provider === AuthProviders.Google) {
    const data = await signIn("google");
    console.log(data);
    return { success: true, message: "Successfully signed in with Google" };
  } else if (provider === AuthProviders.GitHub) {
    const data = await signIn("github");
    console.log(data);
    return { success: true, message: "Successfully signed in with GitHub" };
  }

  return { success: false, message: "Invalid provider" };
}

async function signOut() {
  await authSignOut();
  return { success: true, message: "Successfully signed out" };
}

export { signInWithEmail, signInWithProvider, signOut };
