import { Skeleton } from "@/components/ui/skeleton";

export default function PromoSkeleton() {
  return (
    <div className="h-full bg-white p-8 rounded-4xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4">
      <Skeleton className="w-14 h-14 rounded-full bg-slate-100" />
      <Skeleton className="h-6 w-3/4 bg-slate-100" />
      <Skeleton className="h-4 w-full bg-slate-100" />
      <Skeleton className="h-4 w-5/6 bg-slate-100" />
      <Skeleton className="h-12 w-full rounded-xl bg-slate-100 mt-2" />
    </div>
  );
}
