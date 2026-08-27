import "./globals.css";

import QueryProvider from "@/components/providers/QueryProvider";
import Toaster from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "مدرسہ مینجمنٹ سسٹم",
  description: "مدرسہ کے انتظام کے لیے ایک جامع نظام",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ur"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,300;1,400&display=swap" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
