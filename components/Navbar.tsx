"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Check Slots", path: "/availability" },
  ];

  // Animation Variants
  const mobileMenuVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "100vh",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants: Variants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-[#FFF5F7]/80 backdrop-blur-md border-b border-pink-100"
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10"
          >
            <Image
              src="/btfeel-icon.png"
              alt="BeautyFeel Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-widest text-stone-800 group-hover:text-pink-500 transition-colors">
              BEAUTYFEEL
            </span>
            <span className="text-[9px] text-stone-500 uppercase tracking-[0.2em]">
              The Beauty Lounge
            </span>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative text-sm uppercase tracking-wide py-1 font-medium text-stone-600 hover:text-pink-500 transition-colors"
              >
                <span className={isActive ? "text-pink-600 font-bold" : ""}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="desktop-underline"
                    className="absolute left-0 top-full h-[2px] w-full bg-pink-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA BUTTON */}
        <motion.a
          href="https://web.facebook.com/beautyfeelSkin"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 bg-linear-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-200"
        >
          <Facebook className="w-4 h-4" /> Book Now
        </motion.a>

        {/* MOBILE MENU TOGGLE */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-stone-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-[#FFF5F7] border-t border-pink-100 absolute w-full px-6 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col gap-6 py-8">
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={mobileItemVariants}>
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-2xl font-light block ${
                      pathname === link.path
                        ? "text-pink-600 font-medium"
                        : "text-stone-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.a
                variants={mobileItemVariants}
                href="https://web.facebook.com/beautyfeelSkin"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-pink-500 text-white py-4 rounded-xl font-bold mt-4 shadow-lg shadow-pink-200"
              >
                <Facebook className="w-5 h-5" /> Book on Facebook
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
