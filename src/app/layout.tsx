import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyBlime Cycling Club | Brooklyn, NY",
  description: "Brooklyn's most passionate cycling community. Riding like our lives depend on it since 2020.",
  openGraph: {
    title: "CyBlime Cycling Club | Brooklyn, NY",
    description: "Brooklyn's most passionate cycling community. Est. 2020.",
    url: "https://cyblime-cyclingclub.com",
    siteName: "CyBlime Cycling Club",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ background: '#0A0A0A', margin: 0, padding: 0 }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
