import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Mohamed Adel - AI Resume",
  description: "Senior Software Engineer | React | Node.js | AWS | Game Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
