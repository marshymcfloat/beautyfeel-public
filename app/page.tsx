import Link from "next/link";
import { Suspense } from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import ActivePromos from "@/components/ActivePromos";
import PromoSkeleton from "@/components/PromoSkeleton";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#FFF0F5] via-[#FFF5F7] to-white relative">
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/2 animate-blob"></div>
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 -translate-x-1/2 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-stone-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
            The Beauty Lounge
          </span>

          <h1 className="text-5xl sm:text-7xl font-light text-stone-900 mb-8 tracking-tight leading-tight">
            Rediscover your <br />
            <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-400">
              inner glow.
            </span>
          </h1>

          <p className="text-lg text-stone-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Experience premium care for your skin, nails, and lashes. Relax with
            our 24/7 massage services in a sanctuary designed for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/availability"
              className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-stone-900/20"
            >
              Check Availability <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/services"
              className="bg-white/60 backdrop-blur-sm text-stone-900 border border-white/60 px-8 py-4 rounded-full font-bold hover:bg-white transition-colors shadow-sm"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-24 relative z-20 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/40 border border-white/60 text-center flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
              <Clock className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-stone-800">
              Operating Hours
            </h3>
            <p className="text-stone-500 text-sm mb-4">
              Open 10:00 AM to 8:00 PM Daily
            </p>
            <div className="inline-block bg-pink-50 border border-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              Massage: 24/7
            </div>
          </div>

          <div className="md:transform md:-translate-y-6">
            <Suspense fallback={<PromoSkeleton />}>
              <ActivePromos />
            </Suspense>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/40 border border-white/60 text-center flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
              <MapPin className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-stone-800">Visit Us</h3>
            <p className="text-stone-500 text-sm mb-6">
              Face • Skin • Nails • Massage
            </p>
            <a
              href="https://web.facebook.com/beautyfeelSkin"
              target="_blank"
              className="text-xs font-bold text-stone-800 border-b-2 border-pink-200 hover:border-pink-500 hover:text-pink-500 transition-all pb-0.5"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
