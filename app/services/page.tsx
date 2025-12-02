import { Suspense } from "react";
import ServicesList from "@/components/ServicesList";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const metadata = {
  title: "Our Services | BeautyFeel",
  description:
    "Explore our range of premium beauty services including nails, skin, lashes, and massage.",
};

function ServicesSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
        >
          <div className="flex justify-between gap-4">
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-12 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
          Our Services
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Expertly curated treatments for your beauty needs.
        </p>
      </div>

      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesList />
      </Suspense>

      <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <Link
          href="https://web.facebook.com/beautyfeelSkin"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center justify-center gap-3 bg-linear-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-rose-500/30 border border-white/20 backdrop-blur-sm transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-rose-500/50 w-full max-w-xs sm:w-auto"
        >
          <Sparkles className="w-5 h-5 fill-white/20" />
          <span className="tracking-wide text-sm">Book Appointment</span>
        </Link>
      </div>
    </main>
  );
}
