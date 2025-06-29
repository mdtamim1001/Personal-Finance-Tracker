import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./Design/Footer";
import { Toaster } from "react-hot-toast";
import Navbar from "./Design/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinTrack",
  description: "FinTrack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Top Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow">
            <Toaster position="top-right" />
            {children}
            </main>

          {/* Footer at Bottom */}
          <Footer />
        </div>
      </body>
    </html>
  );
}

