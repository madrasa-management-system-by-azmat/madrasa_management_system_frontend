import RequireAuth from "@/components/auth/RequireAuth";
import ParentPortalPage from "@/components/parent/ParentPortalPage";

export default function ParentPage() {
  return (
    <RequireAuth>
      <ParentPortalPage />
    </RequireAuth>
  );
}
