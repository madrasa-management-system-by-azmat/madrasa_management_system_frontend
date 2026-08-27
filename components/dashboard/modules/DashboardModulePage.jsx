import ModuleHeader from "@/components/dashboard/modules/ModuleHeader";
import ModuleRecords from "@/components/dashboard/modules/ModuleRecords";
import ModuleStats from "@/components/dashboard/modules/ModuleStats";
import ModuleSummary from "@/components/dashboard/modules/ModuleSummary";

export default function DashboardModulePage({ module }) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <ModuleHeader
        icon={module.icon}
        eyebrow={module.eyebrow}
        title={module.title}
        description={module.description}
        actionLabel={module.actionLabel}
      />
      <ModuleStats stats={module.stats} />
      <div className="grid gap-6 xl:grid-cols-2">
        <ModuleRecords
          title={module.recordsTitle}
          description={module.recordsDescription}
          records={module.records}
          icon={module.icon}
        />
        <ModuleSummary
          title={module.summaryTitle}
          description={module.summaryDescription}
          items={module.summaryItems}
        />
      </div>
    </div>
  );
}
