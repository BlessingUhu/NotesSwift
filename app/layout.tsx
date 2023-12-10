"use client"

import "./globals.scss";
import {Inter} from "next/font/google";
import { SessionProvider } from "next-auth/react";

const inter = Inter({subsets: ["latin"]});

// export const metadata = {
//   title: "Trend Reach",
//   description: "Generated using Next JS",
// };

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <title>To do App</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
} 
