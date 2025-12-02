import AvailabilityDashboard from "@/components/AvailabilityDashboard";

export default function AvailabilityPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-light text-slate-900">Check Slots</h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-2">
          Live Database View
        </p>
      </div>

      <AvailabilityDashboard />

      <div className="text-center mt-8 max-w-xs mx-auto">
        <p className="text-slate-400 text-sm mb-4">Found a slot you like?</p>
        <a
          href="https://web.facebook.com/beautyfeelSkin"
          target="_blank"
          className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
        >
          Message us on Facebook to Book
        </a>
      </div>
    </main>
  );
}
