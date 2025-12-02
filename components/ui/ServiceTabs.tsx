"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Clock, Sparkles, ArrowRight, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Database } from "@/database.types";

type Service = Database["public"]["Tables"]["service"]["Row"];

const BRANCH_ORDER = ["NAILS", "SKIN", "LASHES", "MASSAGE"];

export default function ServiceTabs({ services }: { services: Service[] }) {
  const availableBranches = Array.from(
    new Set(services.map((s) => s.branch))
  ).sort((a, b) => BRANCH_ORDER.indexOf(a) - BRANCH_ORDER.indexOf(b));

  const [activeTab, setActiveTab] = useState(availableBranches[0] || "NAILS");

  const filteredServices = services.filter((s) => s.branch === activeTab);

  return (
    <div className="w-full">
      <div className="sticky top-20 z-30 flex justify-center mb-10">
        <div className="flex  justify-center gap-1 p-1.5 bg-stone-100/50 backdrop-blur-xs  rounded-full border border-stone-200/50">
          {availableBranches.map((branch) => {
            const isActive = activeTab === branch;
            return (
              <button
                key={branch}
                onClick={() => setActiveTab(branch)}
                className={`relative px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-colors duration-300 z-10 ${
                  isActive
                    ? "text-pink-600"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {branch}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-pink-100 -z-10"
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout="position"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="h-full cursor-pointer border-pink-100/50 bg-white/60 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-pink-100/40 hover:-translate-y-0.5 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1.5">
                          {service.category && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-bold tracking-widest uppercase text-stone-400 bg-stone-50 group-hover:bg-emerald-50/50 group-hover:text-emerald-600 transition-colors"
                            >
                              {service.category}
                            </Badge>
                          )}
                          <CardTitle className="text-lg font-bold text-stone-800 leading-tight group-hover:text-pink-600 transition-colors duration-300">
                            {service.title}
                          </CardTitle>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-pink-600 bg-pink-50/50 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                            ₱{service.price}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 group-hover:text-stone-600 transition-colors duration-300">
                        {service.description || "Tap to view full details."}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-2 pb-5 relative z-10 flex items-center justify-between border-t border-stone-50 mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-400 uppercase tracking-wide">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration_minutes} mins
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-pink-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardFooter>
                  </Card>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md bg-[#FFF5F7] border-none shadow-2xl p-0 overflow-hidden gap-0">
                  <div className="bg-linear-to-br from-pink-300 via-rose-300 to-red-200 p-8 text-white relative overflow-hidden">
                    <Sparkles className="absolute top-4 right-4 w-24 h-24 text-white opacity-20 rotate-12" />
                    <DialogHeader>
                      <div className="flex items-center gap-2 mb-2 opacity-90">
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-md"
                        >
                          {service.branch}
                        </Badge>
                        {service.category && (
                          <span className="text-xs font-medium tracking-wide uppercase">
                            {service.category}
                          </span>
                        )}
                      </div>
                      <DialogTitle className="text-3xl font-light tracking-tight text-white relative z-10">
                        {service.title}
                      </DialogTitle>
                    </DialogHeader>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-pink-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          Price
                        </span>
                        <span className="text-2xl font-bold text-stone-800">
                          ₱{service.price}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-stone-100"></div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          Duration
                        </span>
                        <span className="text-lg font-medium text-stone-600 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-pink-400" />{" "}
                          {service.duration_minutes}m
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                        About this Service
                      </h4>
                      <DialogDescription className="text-stone-600 leading-relaxed text-base">
                        {service.description ||
                          "Enjoy a premium experience with our expert staff. This service is designed to make you feel refreshed and beautiful."}
                      </DialogDescription>
                    </div>
                  </div>

                  <DialogFooter className="p-6 pt-2 bg-transparent flex-col sm:flex-row gap-3">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-pink-200 hover:bg-pink-50 text-stone-600 hover:text-pink-600"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      asChild
                      className="w-full sm:flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg shadow-pink-200"
                    >
                      <a
                        href="https://web.facebook.com/beautyfeelSkin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Facebook className="w-4 h-4" /> Book on Facebook
                      </a>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredServices.length === 0 && (
        <div className="text-center py-20 text-stone-400 bg-white/50 rounded-3xl border border-dashed border-stone-200">
          <p>No services found for this category.</p>
        </div>
      )}
    </div>
  );
}
