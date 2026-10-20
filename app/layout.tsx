import type { Metadata } from "next";

import "./globals.css";
import { ReactNode } from 'react';
import ThemeProvider from '../components/ThemeProvider'
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Escrow Africa",
  description: "Secure escrow payments for buyers and sellers.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <ThemeProvider >
        {children}
        <Toaster position="top-right" />
        </ThemeProvider>
      </body>
  </html>
  
  );
}
