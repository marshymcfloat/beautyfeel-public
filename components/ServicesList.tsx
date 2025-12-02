import { createClient } from "@/utils/supabase/server";
import ServiceTabs from "@/components/ui/ServiceTabs";

async function getServices() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("service")
    .select("*")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return services;
}

export default async function ServicesList() {
  const services = await getServices();

  if (!services.length) {
    return (
      <div className="text-center py-12 text-slate-500">
        No services available at the moment.
      </div>
    );
  }

  return <ServiceTabs services={services} />;
}
