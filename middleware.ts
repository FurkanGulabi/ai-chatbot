import NextAuth from "next-auth";
import { authOptions } from "./auth";

export const { auth: middleware } = NextAuth(authOptions);
