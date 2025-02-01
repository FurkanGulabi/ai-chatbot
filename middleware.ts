import NextAuth from "next-auth";
import { authOptions } from "./auth";

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // Redirect authenticated users away from auth routes
  if (nextUrl.pathname.startsWith("/auth") && isAuthenticated) {
    return Response.redirect(new URL("/", nextUrl));
  }
});

// Optional: Only run middleware on auth routes
export const config = {
  matcher: ["/auth"],
};
