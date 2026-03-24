import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "socmed-agent | Architectural Minimalist",
  description: "An intelligent social media orchestrator",
};

import Sidebar from "./components/Sidebar";
import { I18nProvider } from "./components/I18nProvider";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isAutopilotEnabled = false;
  try {
    const persona = await prisma.persona.findFirst();
    isAutopilotEnabled = persona?.isAutopilotEnabled ?? false;
  } catch (e) {
    console.error("Failed to fetch persona in layout:", e);
  }
  return (
    <html lang="en">
      <body className={inter.variable} style={{ 
        height: '100vh', 
        overflow: 'hidden', 
        display: 'flex',
        background: 'var(--surface)' 
      }}>
        <I18nProvider>
          <Sidebar isAutopilotActive={isAutopilotEnabled} />
          <main style={{ 
            flex: 1, 
            margin: '0.75rem 0.75rem 0.75rem 0',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 24px -2px rgba(22, 28, 34, 0.06), 0 2px 8px -1px rgba(22, 28, 34, 0.04)',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
