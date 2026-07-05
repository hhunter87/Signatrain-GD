import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GD & Signatrain",
  description: "Greenwald Doherty client services and Signatrain learning platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout applies to every page; the pages-router rule is a false positive here. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
        {children}
      </body>
    </html>
  );
}
