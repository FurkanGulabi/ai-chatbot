import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
  },
  session: {
    cookieCache: {
      enabled: true, // defaults to false
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [nextCookies()],
});
