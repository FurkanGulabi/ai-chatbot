import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;

  console.log("Is logged in:", isLoggedIn);

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard", "/login", "/register", "/"],
};
