import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionContextProvider from "./session_context";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@/lib/progress_bar";
import { LOGO_ONLY } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AcademiX",
  icons: LOGO_ONLY,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider>
          <ProgressBar>{children}</ProgressBar>
        </SessionContextProvider>
        <Toaster toastOptions={{}} />
      </body>
    </html>
  );
}
