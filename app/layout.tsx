import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "BeautyFeel | The Beauty Lounge",
    template: "%s | BeautyFeel",
  },
  description: "Face, Skin, Nails, Massage. Open 10am-8pm Daily.",
  keywords: ["Beauty", "Salon", "Massage", "Nails", "Skin Care", "BeautyFeel"],
  openGraph: {
    title: "BeautyFeel | The Beauty Lounge",
    description: "Experience premium care for your skin, nails, and lashes.",
    url: "https://www.beautyfeel.net",
    siteName: "BeautyFeel",
    images: [
      {
        url: "/btfeel-icon.png",
        width: 800,
        height: 600,
        alt: "BeautyFeel Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FFF5F7] text-stone-800 antialiased selection:bg-pink-200">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
