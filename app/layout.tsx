import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // you can choose what weights you want
  display: "swap",
});

export const metadata: Metadata = {
  title: "React Canvas",
  description: "Edit your components visually",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable} font-mono antialiased bg-custom-grey text-white`}
      >
        {children}
      </body>
    </html>
  );
}
