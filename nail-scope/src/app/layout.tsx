'use client';
import * as React from "react";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>Anailytic</title>
      </head>
      <body>
        <AuthProvider>
          {pathname !== "/login" && pathname !== "/register" && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
