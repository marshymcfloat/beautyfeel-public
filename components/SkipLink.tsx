import Link from "next/link";

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-6 py-3 bg-white text-stone-900 font-bold rounded-full shadow-xl border border-pink-200 outline-none ring-2 ring-pink-500 transition-all"
    >
      Skip to content
    </Link>
  );
}

