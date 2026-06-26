import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GD & Signatrain Demo",
  description: "Disposable fictional demo for GD and Signatrain stakeholder validation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
