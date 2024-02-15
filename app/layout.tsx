"use client";
import "./globals.scss";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Inter} from "next/font/google";
import {SessionProvider} from "next-auth/react";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <title>NoteSwift</title>
        <link  rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={inter.className}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider>{children}</SessionProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
