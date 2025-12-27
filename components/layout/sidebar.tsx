"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Maintenance", path: "/maintenance", icon: Wrench },
  { name: "Equipment", path: "/equipment", icon: Package },
  { name: "Teams", path: "/teams", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            GearGuard
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span
                className={cn(
                  "mr-3",
                  isActive
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              >
                <Icon size={20} />
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center w-full p-2 rounded-lg bg-gray-50 border border-gray-100 mb-3">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="h-9 w-9 rounded-full bg-gray-200 border border-white shadow-sm"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary/20 border border-white shadow-sm flex items-center justify-center text-primary font-semibold text-sm">
              {user.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user.role?.toLowerCase() || "Member"}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}


