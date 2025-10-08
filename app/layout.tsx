import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "AI Tutor",
  description: "An AI tutoring platform powered by Next.js and Supabase",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
