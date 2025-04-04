'use client';
import * as React from "react";
import Navbar from "./components/Navbar";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AuthContext";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ChatProvider} from './context/ChatContext';
import ChatButton from './components/small-components/ChatButton';

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
          <ChatProvider>
            {pathname !== "/login" && pathname !== "/register" && <Navbar />}
            <ChatButton />
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
