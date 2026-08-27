"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  Award,
  BedDouble,
  BookOpenText,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  FileUser,
  GraduationCap,
  History,
  LayoutDashboard,
  List,
  LogOut,
  Settings2,
  UserPlus,
  UserRound,
  UserCog,
  CreditCard,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { getMediaUrl } from "@/lib/apiClient";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const text = {
  academics: "\u062A\u0639\u0644\u06CC\u0645\u06CC \u0627\u0645\u0648\u0631",
  attendance: "\u062D\u0627\u0636\u0631\u06CC",
  closeMenu:
    "\u0645\u06CC\u0646\u06CC\u0648 \u0628\u0646\u062F \u06A9\u0631\u06CC\u06BA",
  dashboard: "\u0688\u06CC\u0634 \u0628\u0648\u0631\u0688",
  exams:
    "\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A \u0648 \u0646\u062A\u0627\u0626\u062C",
  examTimetable:
    "\u0627\u0645\u062A\u062D\u0627\u0646\u06CC \u0679\u0627\u0626\u0645 \u0679\u06CC\u0628\u0644",
  examMarks: "\u0637\u0644\u0628\u06C1 \u06A9\u06D2 \u0646\u0645\u0628\u0631",
  examResults: "\u0646\u062A\u0627\u0626\u062C",
  finance: "\u0645\u0627\u0644\u06CC\u0627\u062A",
  financeOverview: "\u0645\u0627\u0644\u06CC \u062E\u0644\u0627\u0635\u06C1",
  feePayments: "\u0641\u06CC\u0633 \u0648\u0635\u0648\u0644\u06CC",
  feeVouchers:
    "\u0641\u06CC\u0633 \u0648\u0627\u0624\u0686\u0631 \u0627\u0648\u0631 \u0628\u0644",
  feePaymentHistory:
    "\u0641\u06CC\u0633 \u0648\u0635\u0648\u0644\u06CC \u06A9\u06CC \u062A\u0627\u0631\u06CC\u062E",
  teacherSalaries:
    "\u0627\u0633\u0627\u062A\u0630\u06C1 \u06A9\u06CC \u062A\u0646\u062E\u0648\u0627\u06C1\u06CC\u06BA",
  hifz: "\u062D\u0641\u0638 \u0648 \u0646\u0627\u0638\u0631\u06C1",
  hostel: "\u06C1\u0627\u0633\u0679\u0644",
  logout: "\u0644\u0627\u06AF \u0622\u0624\u0679",
  logoutSuccess:
    "\u0622\u067E \u06A9\u0627 \u0645\u062D\u0641\u0648\u0638 \u0637\u0631\u06CC\u0642\u06D2 \u0633\u06D2 \u0644\u0627\u06AF \u0622\u0624\u0679 \u06A9\u0631 \u062F\u06CC\u0627 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4",
  loggingOut:
    "\u0644\u0627\u06AF \u0622\u0624\u0679 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
  mainMenu: "\u0645\u06CC\u0646 \u0645\u06CC\u0646\u06CC\u0648",
  madrasaName:
    "\u0645\u062F\u0631\u0633\u06C1 \u0641\u06CC\u0636\u0627\u0646 \u0627\u0644\u0642\u0631\u0622\u0646",
  navigation:
    "\u0645\u0631\u06A9\u0632\u06CC \u0646\u06CC\u0648\u06CC\u06AF\u06CC\u0634\u0646",
  profile:
    "\u0645\u06CC\u0631\u0627 \u067E\u0631\u0648\u0641\u0627\u0626\u0644",
  role: "\u0635\u0627\u0631\u0641",
  settings: "\u062A\u0631\u062A\u06CC\u0628\u0627\u062A",
  students: "\u0637\u0644\u0628\u06C1",
  subjects: "\u0645\u0636\u0627\u0645\u06CC\u0646",
  teachers: "\u0627\u0633\u0627\u062A\u0630\u06C1",
  studentsList:
    "\u0637\u0644\u0628\u06c1 \u06a9\u06cc \u0641\u06c1\u0631\u0633\u062a",
  addStudent: "\u0646\u06cc\u0627 \u0637\u0627\u0644\u0628 \u0639\u0644\u0645",
  studentDetails:
    "\u0637\u0644\u0628\u06c1 \u06a9\u06cc \u062a\u0641\u0635\u06cc\u0644\u0627\u062a",
  systemName:
    "\u0646\u0638\u0627\u0645\u0650 \u0627\u0646\u062A\u0638\u0627\u0645",
};

const navigation = [
  {
    label: "مدارس کا انتظام",
    icon: Building2,
    href: "/dashboard/super-admin",
    superAdminOnly: true,
  },
  { label: text.dashboard, icon: LayoutDashboard, href: "/dashboard" },
  {
    label: text.students,
    icon: UsersRound,
    href: "/dashboard/students",
    children: [
      { label: text.studentsList, icon: List, href: "/dashboard/students" },
      {
        label: text.studentDetails,
        icon: FileUser,
        href: "/dashboard/students/details",
      },
      {
        label: text.addStudent,
        icon: UserPlus,
        href: "/dashboard/students/add",
      },
      {
        label: "شناختی کارڈ",
        icon: CreditCard,
        href: "/dashboard/students/id-cards",
      },
      {
        label: "اسناد",
        icon: Award,
        href: "/dashboard/students/certificates",
      },
    ],
  },
  {
    label: text.academics,
    icon: BookOpenText,
    href: "/dashboard/academics",
    menuId: "academics",
    children: [
      {
        label: text.academics,
        icon: BookOpenText,
        href: "/dashboard/academics",
      },
      {
        label: text.subjects,
        icon: BookOpenText,
        href: "/dashboard/academics/subjects",
      },
    ],
  },
  {
    label: text.teachers,
    icon: UserCog,
    href: "/dashboard/teachers",
    roles: ["admin", "operator"],
  },
  { label: text.hifz, icon: GraduationCap, href: "/dashboard/hifz" },
  {
    label: text.exams,
    icon: FileCheck2,
    href: "/dashboard/exams",
    menuId: "exams",
    children: [
      { label: text.exams, icon: FileCheck2, href: "/dashboard/exams" },
      {
        label: text.examTimetable,
        icon: ClipboardCheck,
        href: "/dashboard/exams/timetable",
      },
      {
        label: text.examMarks,
        icon: ClipboardCheck,
        href: "/dashboard/exams/marks",
      },
      {
        label: text.examResults,
        icon: FileCheck2,
        href: "/dashboard/exams/results",
      },
    ],
  },
  {
    label: text.attendance,
    icon: ClipboardCheck,
    href: "/dashboard/attendance",
    menuId: "attendance",
    children: [
      {
        label: "روزانہ حاضری",
        icon: ClipboardCheck,
        href: "/dashboard/attendance",
      },
      {
        label: "حاضری رپورٹس",
        icon: History,
        href: "/dashboard/attendance/reports",
      },
    ],
  },
  { label: text.hostel, icon: BedDouble, href: "/dashboard/hostel" },
  {
    label: text.finance,
    icon: BadgeDollarSign,
    href: "/dashboard/finance",
    menuId: "finance",
    children: [
      {
        label: text.financeOverview,
        icon: WalletCards,
        href: "/dashboard/finance",
      },
      {
        label: text.feePayments,
        icon: BadgeDollarSign,
        href: "/dashboard/finance/payments",
      },
      {
        label: text.feeVouchers,
        icon: WalletCards,
        href: "/dashboard/finance/fees",
      },
      {
        label: text.feePaymentHistory,
        icon: History,
        href: "/dashboard/finance/history",
      },
      {
        label: text.teacherSalaries,
        icon: WalletCards,
        href: "/dashboard/finance/salaries",
      },
    ],
    roles: ["admin", "accountant"],
  },
  {
    label: "صارفین کا انتظام",
    icon: UserCog,
    href: "/dashboard/users",
    roles: ["admin"],
  },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, endSession, isSuperAdmin } = useAuthContext();
  const isStudentsSectionActive = pathname.startsWith("/dashboard/students");
  const isAcademicsSectionActive = pathname.startsWith("/dashboard/academics");
  const isExamsSectionActive = pathname.startsWith("/dashboard/exams");
  const isAttendanceSectionActive = pathname.startsWith(
    "/dashboard/attendance",
  );
  const isFinanceSectionActive = pathname.startsWith("/dashboard/finance");
  const [openMenu, setOpenMenu] = useState(() => {
    if (isStudentsSectionActive) return "students";
    if (isAcademicsSectionActive) return "academics";
    if (isExamsSectionActive) return "exams";
    if (isAttendanceSectionActive) return "attendance";
    if (isFinanceSectionActive) return "finance";
    return null;
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    text.role;
  const initial = fullName.charAt(0) || text.role.charAt(0);

  async function handleLogout() {
    setIsLoggingOut(true);
    await endSession();
    toast.success(text.logout, text.logoutSuccess);
    router.replace("/auth");
  }

  function toggleMenu(menuId) {
    setOpenMenu((current) => (current === menuId ? null : menuId));
    setIsProfileOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label={text.closeMenu}
        className={cn(
          "fixed inset-0 z-30 bg-foreground/20 transition-opacity duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-72 translate-x-full flex-col overflow-y-hidden border-l border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          isOpen && "translate-x-0",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={text.closeMenu}
            onClick={onClose}
          >
            <X />
          </Button>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">
                {text.madrasaName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {text.systemName}
              </p>
            </div>
          </div>
        </div>

        <nav
          className="flex-1 space-y-1 overflow-y-auto px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={text.navigation}
        >
          <p className="px-3 pb-2 text-xs font-medium text-muted-foreground">
            {text.mainMenu}
          </p>
          {navigation
            .filter((item) =>
              isSuperAdmin
                ? item.superAdminOnly
                : !item.superAdminOnly &&
                  (!item.roles || item.roles.includes(user?.role)),
            )
            .map(({ label, icon: Icon, href, children, menuId }) => {
              const isActive = children
                ? menuId === "finance"
                  ? isFinanceSectionActive
                  : menuId === "academics"
                    ? isAcademicsSectionActive
                    : menuId === "exams"
                      ? isExamsSectionActive
                      : menuId === "attendance"
                        ? isAttendanceSectionActive
                        : isStudentsSectionActive
                : pathname === href;
              const isMenuOpen = openMenu === (menuId || "students");
              const menuControlId = `${menuId || "students"}-menu`;

              if (children) {
                return (
                  <div key={label}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      aria-expanded={isMenuOpen}
                      aria-controls={menuControlId}
                      onClick={() => toggleMenu(menuId || "students")}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span className="flex-1 text-right">{label}</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          isMenuOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {isMenuOpen && (
                      <div
                        id={menuControlId}
                        className="mr-4 mt-1 space-y-1 border-r border-sidebar-border pr-2"
                      >
                        {children.map(
                          ({
                            label: childLabel,
                            icon: ChildIcon,
                            href: childHref,
                          }) => {
                            const isChildActive = pathname === childHref;

                            return (
                              <Link
                                key={childHref}
                                href={childHref}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                                  isChildActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                )}
                              >
                                <ChildIcon
                                  className="size-4"
                                  aria-hidden="true"
                                />
                                {childLabel}
                              </Link>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => {
                    setOpenMenu(null);
                    onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {user?.role === "admin" && (
            <Link
              href="/dashboard/settings"
              onClick={() => {
                setOpenMenu(null);
                onClose();
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/65 transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Settings2 className="size-4" aria-hidden="true" />
              {text.settings}
            </Link>
          )}

          <div className="relative mt-3">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl bg-sidebar-accent p-3 text-right transition-colors hover:bg-sidebar-accent/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-expanded={isProfileOpen}
              aria-controls="profile-menu"
              onClick={() => {
                setIsProfileOpen((open) => !open);
                setOpenMenu(null);
              }}
            >
              <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-info text-xs font-bold text-info-foreground">
                {user?.photo ? (
                  <Image
                    src={getMediaUrl(user.photo)}
                    alt={fullName}
                    width={36}
                    height={36}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{fullName}</p>
                <p className="truncate text-xs text-sidebar-foreground/65">
                  {user?.role || text.role}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform",
                  isProfileOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {isProfileOpen && (
              <div
                id="profile-menu"
                className="absolute bottom-full right-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
              >
                <Link
                  href="/dashboard/profile"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onClose();
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <UserRound className="size-4" aria-hidden="true" />
                  {text.profile}
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  {isLoggingOut ? text.loggingOut : text.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
