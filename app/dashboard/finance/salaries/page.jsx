import FinanceManagement from "@/components/dashboard/finance/FinanceManagement";

export default function TeacherSalariesPage() {
  return <FinanceManagement defaultTab="salaries" showFees={false} />;
}
