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
  LayoutGrid,
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
        className={`flex items-center justify-between py-2.5 px-4 rounded-xl mb-2 transition-all duration-500 group ${
          isFull
            ? "bg-stone-50/50 opacity-60"
            : "bg-white border border-pink-50/50 shadow-sm hover:shadow-md hover:border-pink-200"
        }`}
      >
        <span
          className={`font-semibold text-base flex items-baseline gap-1 ${
            isFull
              ? "text-stone-300 line-through decoration-stone-200"
              : "text-stone-700"
          }`}
        >
          {slot.slot_time.replace(/ [AP]M/, "")}
          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wide">
            {slot.slot_time.slice(-2)}
          </span>
        </span>

        {isFull ? (
          <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-md">
            Full
          </span>
        ) : (
          <div
            className={`transition-all duration-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
              isLow
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isLow ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            ></div>
            {slot.available_spots === 1 ? "1 Left" : `${slot.available_spots}`}
          </div>
        )}
      </div>
    );
  };

  const TimeSection = ({
    title,
    icon: Icon,
    colorClass,
    data,
    delay,
  }: {
    title: string;
    icon: any;
    colorClass: string;
    data: AvailabilitySlot[];
    delay: string;
  }) => {
    if (data.length === 0) return null;
    return (
      <section
        className={`flex-1 min-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-500 ${delay}`}
      >
        <div
          className={`flex items-center gap-2 mb-3 ${colorClass} text-[11px] font-black uppercase tracking-widest pl-1`}
        >
          <Icon className="w-3.5 h-3.5" /> {title}
        </div>
        <div className="space-y-1">{data.map(renderSlot)}</div>
      </section>
    );
  };

  return (
    <div className="w-full max-w-md md:max-w-7xl mx-auto bg-white/40 backdrop-blur-xl md:min-h-[700px] h-screen md:h-auto rounded-none md:rounded-[2.5rem] overflow-hidden relative border-x md:border border-white/50 shadow-2xl shadow-pink-100/50 flex flex-col md:flex-row">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="md:w-[320px] shrink-0 bg-white/60 backdrop-blur-md p-6 md:p-8 md:border-r border-b md:border-b-0 border-white/50 flex flex-col md:h-auto z-20">
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl font-light text-stone-800 flex items-center gap-2 tracking-tight">
            Live Vibe{" "}
            <Sparkles className="w-5 h-5 text-pink-400 fill-pink-50" />
          </h1>
          <p className="text-stone-500 text-xs font-medium mt-1 uppercase tracking-widest">
            Real-time Capacity
          </p>
        </div>

        <div className="relative group mb-6 md:mb-8">
          <label className="text-[10px] uppercase font-bold text-stone-400 mb-2 block tracking-wider">
            Select Date
          </label>
          <div className="flex items-center justify-between bg-white hover:bg-white/80 border border-stone-100 hover:border-pink-200 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm group-hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-pink-50 p-2 rounded-lg text-pink-500">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-medium text-stone-400">
                  {isToday ? "Today" : "Selected"}
                </span>
                <span className="text-sm font-bold text-stone-700">
                  {displayDate}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-[10px] uppercase font-bold text-stone-400 mb-2 block tracking-wider hidden md:block">
            Departments
          </label>
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {BRANCHES.map((branch) => (
              <button
                key={branch}
                onClick={() => setActiveBranch(branch)}
                className={`shrink-0 flex items-center justify-between px-4 py-3 rounded-xl md:rounded-2xl text-xs font-bold tracking-widest transition-all duration-300 w-auto md:w-full ${
                  activeBranch === branch
                    ? "bg-pink-950 text-white shadow-lg shadow-pink-900/10 scale-100 ring-2 ring-offset-2 ring-pink-950/10"
                    : "bg-white text-stone-400 border border-stone-100 hover:border-pink-200 hover:text-pink-500 hover:shadow-sm"
                }`}
              >
                <span>{branch}</span>
                {activeBranch === branch && (
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)] hidden md:block"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:block mt-auto pt-6 border-t border-stone-100">
          <div className="flex flex-col gap-3 text-[10px] font-bold text-stone-400 uppercase tracking-wide">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Open
              for Booking
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>{" "}
              Limited Spots
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span> Fully
              Booked
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col h-full bg-white/30">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
          {initialLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 animate-pulse space-y-6">
              <div className="bg-white/50 p-6 rounded-full">
                <Clock className="w-12 h-12 opacity-30" />
              </div>
              <div className="text-center">
                <div className="h-4 w-32 bg-stone-200/50 rounded mx-auto mb-2"></div>
                <p className="text-xs font-medium opacity-60">
                  Syncing with schedule...
                </p>
              </div>
            </div>
          ) : slots.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-stone-50 shadow-sm">
                <Moon className="w-10 h-10 text-stone-300" />
              </div>
              <h3 className="font-semibold text-lg text-stone-700">
                All Quiet
              </h3>
              <p className="text-sm mt-1 mb-2">
                No availability found for {activeBranch.toLowerCase()}.
              </p>
              <p className="text-xs bg-stone-100 px-3 py-1 rounded-full">
                Try selecting a different date
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-stone-700 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-stone-400" />
                  Available Slots
                </h2>
                <span className="text-xs font-medium text-stone-400 bg-white/60 px-3 py-1 rounded-full border border-stone-100">
                  {slots.filter((s) => s.available_spots > 0).length} Openings
                  Found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-10">
                <TimeSection
                  title="Late Night"
                  icon={Stars}
                  colorClass="text-purple-400"
                  data={groupedSlots.lateNight}
                  delay="delay-0"
                />
                <TimeSection
                  title="Morning"
                  icon={Coffee}
                  colorClass="text-rose-400"
                  data={groupedSlots.morning}
                  delay="delay-75"
                />
                <TimeSection
                  title="Afternoon"
                  icon={Sun}
                  colorClass="text-amber-500"
                  data={groupedSlots.afternoon}
                  delay="delay-100"
                />
                <TimeSection
                  title="Evening"
                  icon={Moon}
                  colorClass="text-pink-900"
                  data={groupedSlots.evening}
                  delay="delay-150"
                />
              </div>
            </div>
          )}
        </div>

        <div className="md:hidden bg-white/80 backdrop-blur-md border-t border-white/50 p-4 text-center z-20">
          <div className="flex justify-center gap-6 text-[10px] font-bold text-stone-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span> Full
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>{" "}
              Limited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
