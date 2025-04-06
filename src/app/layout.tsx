import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "../app/providers/queryClient";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Management - React Query Demo",
  description: "A comprehensive React Query example with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
