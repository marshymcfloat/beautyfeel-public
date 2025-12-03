import { createClient } from "@/utils/supabase/server";
import { Sparkles, TicketPercent, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getActiveDiscounts() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: discounts } = await supabase
    .from("discount")
    .select("*")
    .eq("status", "ACTIVE")
    .lte("start_date", today) // Started today or before
    .gte("end_date", today) // Ends today or after
    .order("end_date", { ascending: true }) // Show ending soonest first
    .limit(1); // Just get the main one for the home page

  return discounts && discounts.length > 0 ? discounts[0] : null;
}

export default async function ActivePromos() {
  const promo = await getActiveDiscounts();

  if (!promo) {
    return (
      <div className="h-full bg-linear-to-br from-pink-400 to-rose-400 p-8  rounded-4xl shadow-xl shadow-rose-200/50 text-center text-white flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>

        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner ring-1 ring-white/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <h2 className="font-bold text-xl mb-2 tracking-tight">Stay Tuned!</h2>
        <p className="text-white/90 text-sm leading-relaxed">
          Follow our Facebook page for upcoming flash sales and exclusive
          seasonal offers.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-linear-to-br from-rose-500 via-pink-500 to-orange-400 p-8 rounded-4xl shadow-xl shadow-rose-300/50 text-center text-white relative overflow-hidden group transition-transform hover:-translate-y-1 duration-300">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 flex flex-col items-center h-full justify-between">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-lg ring-1 ring-white/40 animate-pulse">
            <PartyPopper className="w-7 h-7 text-white" />
          </div>

          {promo.branch && (
            <Badge
              variant="secondary"
              className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm"
            >
              {promo.branch} Only
            </Badge>
          )}

          <h2 className="font-bold text-2xl mb-2 tracking-tight leading-tight">
            {promo.name}
          </h2>

          <p className="text-white/90 text-sm mb-4 line-clamp-2">
            {promo.description || "Limited time offer! Visit us today."}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 w-full border border-white/10 flex items-center justify-center gap-3">
          <TicketPercent className="w-5 h-5 text-white/80" />
          <span className="font-bold text-lg">
            {promo.discount_type === "PERCENTAGE"
              ? `${promo.discount_value}% OFF`
              : `₱${promo.discount_value} OFF`}
          </span>
        </div>

        <p className="text-[10px] text-white/60 mt-3 font-medium uppercase tracking-wider">
          Valid until {new Date(promo.end_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
