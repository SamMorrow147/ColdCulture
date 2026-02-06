import type { Metadata } from "next";
import { Geist, Geist_Mono, Krona_One } from "next/font/google";
import HamburgerMenu from "@/components/HamburgerMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kronaOne = Krona_One({
  variable: "--font-krona",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cold Culture",
  description: "High-end lifestyle brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/Heroimage.png" as="image" />
        <link rel="preload" href="/CenterFigure.png" as="image" />
        <link rel="preload" href="/ColdCulture.svg" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kronaOne.variable} antialiased`}
      >
        <HamburgerMenu>{children}</HamburgerMenu>
      </body>
    </html>
  );
}
