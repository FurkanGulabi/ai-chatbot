import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;
  const isOnChat = nextUrl.pathname.startsWith("/");
  const isOnRegister = nextUrl.pathname.startsWith("/register");
  const isOnLogin = nextUrl.pathname.startsWith("/login");

  console.log("Is logged in:", isLoggedIn);

  if (isLoggedIn && (isOnLogin || isOnRegister)) {
    return Response.redirect(new URL("/", nextUrl));
  }

  if (!isLoggedIn && isOnChat) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard", "/login", "/register", "/"],
};
