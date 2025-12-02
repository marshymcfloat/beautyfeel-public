import { createClient } from "@/utils/supabase/server";
import { Sparkles, Tag } from "lucide-react";
import * as motion from "framer-motion/client";

async function getActiveDiscount() {
  const supabase = await createClient();
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("discount")
    .select("*")
    .eq("status", "ACTIVE")
    .lte("start_date", today)
    .gte("end_date", today)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching discount:", error);
    return null;
  }

  return data;
}

export default async function DiscountPromo() {
  const discount = await getActiveDiscount();

  if (!discount) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-linear-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-center text-white"
      >
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
          <Sparkles className="w-6 h-6 text-amber-300" />
        </div>
        <h3 className="font-bold text-lg mb-2">Stay Tuned!</h3>
        <p className="text-white/70 text-sm max-w-xs mx-auto">
          Follow our social media pages for upcoming exclusive deals and
          seasonal promos.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-linear-to-br from-rose-500 to-orange-400 p-8 rounded-3xl shadow-xl shadow-rose-200/50 text-center text-white relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300 rounded-full blur-2xl mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm ring-1 ring-white/30 shadow-lg">
          <Tag className="w-6 h-6 text-white rotate-90" />
        </div>

        <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10">
          Limited Time Offer
        </div>

        <h3 className="font-bold text-2xl mb-2 tracking-tight">
          {discount.name}
        </h3>

        <p className="text-white/90 text-sm mb-4 max-w-sm mx-auto leading-relaxed">
          {discount.description || "Don't miss out on this special offer!"}
        </p>

        <div className="flex flex-col items-center gap-1">
          <div className="text-4xl font-black text-white drop-shadow-md">
            {discount.discount_type === "PERCENTAGE"
              ? `${discount.discount_value}% OFF`
              : `₱${discount.discount_value} OFF`}
          </div>
          {discount.branch && (
            <span className="text-xs font-medium opacity-80 bg-black/10 px-2 py-0.5 rounded text-white/90">
              on {discount.branch} services
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
