import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "../app/providers/queryClient";
import Navbar from "@/app/components/Navbar";
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
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-4">
              <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} My Blog</p>
              </div>
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
