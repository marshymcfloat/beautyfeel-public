import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BeautyFeel | The Beauty Lounge",
  description: "Face, Skin, Nails, Massage. Open 10am-8pm Daily.",
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
