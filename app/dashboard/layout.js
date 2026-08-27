import DashboardShell from "@/components/dashboard/DashboardShell";
import RequireAuth from "@/components/auth/RequireAuth";

export default function DashboardLayout({ children }) {
  return <RequireAuth><DashboardShell>{children}</DashboardShell></RequireAuth>;
}
