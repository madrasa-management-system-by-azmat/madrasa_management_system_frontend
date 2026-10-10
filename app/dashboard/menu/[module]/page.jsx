import { notFound } from "next/navigation";

import DashboardSubmenuGrid from "@/components/dashboard/DashboardSubmenuGrid";
import { moduleSubmenus } from "@/lib/dashboardNavigation";

export function generateStaticParams() {
  return Object.keys(moduleSubmenus).map((module) => ({ module }));
}

export default async function DashboardModuleMenuPage({ params }) {
  const { module } = await params;

  if (!moduleSubmenus[module]) {
    notFound();
  }

  return <DashboardSubmenuGrid moduleKey={module} />;
}
