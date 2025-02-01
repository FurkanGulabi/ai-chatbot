import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Karla } from "next/font/google";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "AI Chatbot",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${karla.variable} antialiased dark`}>
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
