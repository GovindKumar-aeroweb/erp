import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  IndianRupee,
  FileText,
  Settings,
  X,
  BookOpen,
  Bus,
  Building,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  onClose: () => void;
  role: Role;
}

const getNavItems = (role: Role) => {
  const common = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Notices", href: "/notices", icon: Bell },
  ];

  const adminNav = [
    { name: "Admissions", href: "/admissions", icon: Users },
    { name: "Students", href: "/students", icon: GraduationCap },
    { name: "User Management", href: "/users", icon: Users },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck },
    { name: "Fees", href: "/fees", icon: IndianRupee },
    { name: "Exams", href: "/exams", icon: FileText },
    { name: "Library", href: "/library", icon: BookOpen },
    { name: "Transport", href: "/transport", icon: Bus },
    { name: "Hostel", href: "/hostel", icon: Building },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const teacherNav = [
    { name: "My Classes", href: "/classes", icon: Users },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck },
    { name: "Exams & Marks", href: "/exams", icon: FileText },
  ];

  const studentNav = [
    { name: "My Profile", href: "/profile", icon: Users },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck },
    { name: "Fees", href: "/fees", icon: IndianRupee },
    { name: "Results", href: "/results", icon: FileText },
  ];

  switch (role) {
    case "super_admin":
    case "school_admin":
    case "principal":
      return [...common, ...adminNav];
    case "teacher":
      return [...common, ...teacherNav];
    case "student":
    case "parent":
      return [...common, ...studentNav];
    default:
      return common;
  }
};

export function Sidebar({ onClose, role }: SidebarProps) {
  const location = useLocation();
  const navItems = getNavItems(role);
  const { signOut } = useAuth();

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Vidya ERP
          </span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-gray-400",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Academic Year
          </p>
          <p className="text-sm font-semibold text-gray-900">2023-2024</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
