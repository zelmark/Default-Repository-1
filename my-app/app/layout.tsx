import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saturn Triton, LLC — Global Holding Company",
  description:
    "Saturn Triton, LLC is a diversified global holding company investing in high-growth sectors across financial services, real estate, technology, and energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#020203] text-[#EDEDEF]">
        {children}
      </body>
    </html>
  );
}
