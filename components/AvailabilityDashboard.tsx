"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "../utils/supabase/client";
import { Database } from "../database.types";
import {
  Sparkles,
  Sun,
  Moon,
  Coffee,
  ChevronRight,
  Clock,
  Stars,
  Calendar,
} from "lucide-react";

type Branch = Database["public"]["Enums"]["branch"];

type AvailabilitySlot = {
  slot_time: string;
  total_capacity: number;
  busy_count: number;
  available_spots: number;
};

const BRANCHES: Branch[] = ["NAILS", "SKIN", "LASHES", "MASSAGE"];

export default function AvailabilityDashboard() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeBranch, setActiveBranch] = useState<Branch>("NAILS");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const supabase = createClient();

  const dateObj = new Date(date);
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = date === todayStr;

  const displayDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const fetchAvailability = useCallback(
    async (isBackgroundUpdate = false) => {
      try {
        if (!isBackgroundUpdate) {
          setInitialLoading(true);
        }

        const { data, error } = await supabase.rpc(
          "get_general_branch_availability",
          {
            p_branch: activeBranch,
            p_date_string: date,
          }
        );

        if (error) throw error;
        setSlots((data as any) || []);
      } catch (err: any) {
        console.error("Error fetching slots:", err);
      } finally {
        setInitialLoading(false);
      }
    },
    [date, activeBranch, supabase]
  );

  useEffect(() => {
    fetchAvailability(false);

    const channel = supabase
      .channel("public:booking")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking" },
        () => {
          fetchAvailability(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAvailability, supabase]);

  const groupedSlots = useMemo(() => {
    const lateNight: AvailabilitySlot[] = [];
    const morning: AvailabilitySlot[] = [];
    const afternoon: AvailabilitySlot[] = [];
    const evening: AvailabilitySlot[] = [];

    slots.forEach((slot) => {
      const timeStr = slot.slot_time;
      const [time, modifier] = timeStr.split(" ");
      let [hours] = time.split(":").map(Number);

      if (hours === 12 && modifier === "AM") hours = 0;
      if (hours !== 12 && modifier === "PM") hours += 12;

      if (hours >= 0 && hours < 6) {
        lateNight.push(slot);
      } else if (hours >= 6 && hours < 12) {
        morning.push(slot);
      } else if (hours >= 12 && hours < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { lateNight, morning, afternoon, evening };
  }, [slots]);

  const renderSlot = (slot: AvailabilitySlot) => {
    const isFull = slot.available_spots <= 0;
    const isLow = slot.available_spots <= 2 && !isFull;

    return (
      <div
        key={slot.slot_time}
        className={`flex items-center justify-between py-3 px-5 rounded-2xl mb-2 transition-all duration-500 ${
          isFull
            ? "bg-stone-50 opacity-60"
            : "bg-white border border-pink-50/50 shadow-sm hover:shadow-md hover:border-pink-200"
        }`}
      >
        <span
          className={`font-semibold text-lg flex items-baseline gap-1 ${
            isFull
              ? "text-stone-300 line-through decoration-stone-200"
              : "text-stone-700"
          }`}
        >
          {slot.slot_time.replace(/ [AP]M/, "")}
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide">
            {slot.slot_time.slice(-2)}
          </span>
        </span>

        {isFull ? (
          <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-lg">
            Full
          </span>
        ) : (
          <div
            className={`transition-all duration-300 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
              isLow
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isLow ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            ></div>
            {slot.available_spots === 1
              ? "1 Spot Left"
              : `${slot.available_spots} Spots`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/40 backdrop-blur-xl min-h-screen sm:min-h-[700px] sm:rounded-[3rem] overflow-hidden relative border border-white/50 shadow-2xl shadow-pink-100/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 bg-white/60 backdrop-blur-md px-6 pt-8 pb-4 rounded-b-4xl border-b border-white/50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-light text-stone-800 flex items-center gap-2 tracking-tight">
              Live Vibe{" "}
              <Sparkles className="w-5 h-5 text-pink-400 fill-pink-50" />
            </h1>
            <p className="text-stone-500 text-xs font-medium mt-1 uppercase tracking-widest">
              Real-time Capacity
            </p>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 bg-white hover:bg-white/80 border border-stone-100 hover:border-pink-200 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-sm font-bold text-stone-600">
                {isToday ? "Today" : displayDate}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 rotate-90" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 no-scrollbar">
          {BRANCHES.map((branch) => (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={`shrink-0 md:px-4 px-3 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${
                activeBranch === branch
                  ? "bg-pink-950 text-white shadow-lg shadow-pink-900/10 scale-100"
                  : "bg-white text-stone-400 border border-stone-100 hover:border-pink-200 hover:text-pink-500"
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-0 px-6 py-6 space-y-8 pb-24 overflow-y-auto h-[calc(100vh-180px)] sm:h-auto">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center pt-20 text-stone-300 animate-pulse space-y-4">
            <Clock className="w-10 h-10 opacity-30" />
            <div className="h-4 w-32 bg-stone-100 rounded"></div>
            <div className="space-y-2 w-full max-w-[200px]">
              <div className="h-10 bg-white/50 rounded-xl"></div>
              <div className="h-10 bg-white/50 rounded-xl"></div>
              <div className="h-10 bg-white/50 rounded-xl"></div>
            </div>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center pt-20 text-stone-400">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-50 shadow-sm">
              <Moon className="w-8 h-8 text-stone-300" />
            </div>
            <p className="font-medium text-stone-600">No availability found.</p>
            <p className="text-xs mt-1">
              The shop might be closed or fully booked.
            </p>
          </div>
        ) : (
          <>
            {groupedSlots.lateNight.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-3 text-purple-400 text-[10px] font-black uppercase tracking-widest pl-1">
                  <Stars className="w-3 h-3" /> Late Night
                </div>
                {groupedSlots.lateNight.map(renderSlot)}
              </section>
            )}

            {groupedSlots.morning.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                <div className="flex items-center gap-2 mb-3 text-rose-400 text-[10px] font-black uppercase tracking-widest pl-1">
                  <Coffee className="w-3 h-3" /> Morning
                </div>
                {groupedSlots.morning.map(renderSlot)}
              </section>
            )}

            {groupedSlots.afternoon.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="flex items-center gap-2 mb-3 text-amber-500 text-[10px] font-black uppercase tracking-widest pl-1">
                  <Sun className="w-3 h-3" /> Afternoon
                </div>
                {groupedSlots.afternoon.map(renderSlot)}
              </section>
            )}

            {groupedSlots.evening.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <div className="flex items-center gap-2 mb-3 text-pink-900 text-[10px] font-black uppercase tracking-widest pl-1">
                  <Moon className="w-3 h-3" /> Evening
                </div>
                {groupedSlots.evening.map(renderSlot)}
              </section>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-white/50 p-4 pb-6 text-center z-20">
        <div className="flex justify-center gap-6 text-[10px] font-bold text-stone-400 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-300"></span> Full
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Limited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Open
          </span>
        </div>
      </div>
    </div>
  );
}
