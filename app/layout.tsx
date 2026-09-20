import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import "./comic-theme.css";
import PwaRegistration from "./pwa-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "PCMC | Walk Through Bible Story",
  description: "Explore the Bible in comics with Xiao Kun and Xiao Jun. 小昆与小君的圣经漫画故事。",
  manifest: "/manifest.webmanifest?v=26",
  themeColor: "#eaf7fb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bible Story",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=26", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-32.png?v=26", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=26", sizes: "16x16", type: "image/png" },
      { url: "/pwa-icon-192.png?v=26", sizes: "192x192", type: "image/png" },
      { url: "/pwa-icon-512.png?v=26", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=26",
    shortcut: "/favicon.ico?v=26",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${notoSerif.variable} antialiased`}
      >
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
