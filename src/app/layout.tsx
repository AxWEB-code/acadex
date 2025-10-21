import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// ✅ Import Outfit and set as default font
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Optional: choose weights you need
});

export const metadata: Metadata = {
  title: "AcadeX",
  description: "Empowering the Future of Academic Excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
