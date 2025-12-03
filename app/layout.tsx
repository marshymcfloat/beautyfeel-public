import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFF5F7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.beautyfeel.net"),
  title: {
    default: "BeautyFeel | The Beauty Lounge",
    template: "%s | BeautyFeel",
  },
  description:
    "Face, Skin, Nails, Massage. Open 10am-8pm Daily. 24/7 Massage available.",
  keywords: [
    "Beauty",
    "Salon",
    "Massage",
    "Nails",
    "Skin Care",
    "BeautyFeel",
    "Spa",
    "Relaxation",
  ],
  authors: [{ name: "BeautyFeel" }],
  creator: "BeautyFeel",
  publisher: "BeautyFeel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "BeautyFeel | The Beauty Lounge",
    description: "Experience premium care for your skin, nails, and lashes.",
    url: "https://www.beautyfeel.net",
    siteName: "BeautyFeel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/btfeel-icon.png",
        width: 800,
        height: 600,
        alt: "BeautyFeel Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeautyFeel | The Beauty Lounge",
    description: "Experience premium care for your skin, nails, and lashes.",
    images: ["/btfeel-icon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/btfeel-icon.png",
  },
  alternates: {
    canonical: "https://www.beautyfeel.net",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "BeautyFeel",
  image: "https://www.beautyfeel.net/btfeel-icon.png",
  "@id": "https://www.beautyfeel.net",
  url: "https://www.beautyfeel.net",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-[#FFF5F7] text-stone-800 antialiased selection:bg-pink-200`}
      >
        <SkipLink />
        <Navbar />
        <div id="main-content">{children}</div>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
