import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

const humane = localFont({
  src: [
    {
      path: '../../public/fonts/Humane-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Humane-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-humane',
});

const plusJakartaSans = localFont({
  src: [
    {
      path: '../../public/fonts/PlusJakartaSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: "ӕgntic",
  description: "∑×√π¢∞≈≠ ∫≤≥ ∠∇∂∆±⊥≡",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${humane.variable} ${plusJakartaSans.variable} font-plus-jakarta antialiased bg-[#f3f3f3]`}>
        <Header />
        <SocialSidebar />
        <main className="min-h-screen pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
