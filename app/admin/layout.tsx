"use client";

import { Users, BookOpen, ClipboardCheck, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
          }
        });
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getNavItems = () => {
    if (!user) return [];

    const items = [];

    if (user.role === "admin") {
      items.push({
        href: "/admin/users",
        icon: Users,
        label: "User Management",
      });
      items.push({
        href: "/admin/teachers",
        icon: Users,
        label: "Teacher Management",
      });
    }

    if (["admin", "teacher", "assistant"].includes(user.role)) {
      items.push({
        href: "/admin/lectures",
        icon: BookOpen,
        label: "Lecture Management",
      });
      items.push({
        href: "/admin/attendance",
        icon: ClipboardCheck,
        label: "Attendance",
      });
      items.push({
        href: "/admin/exams",
        icon: GraduationCap,
        label: "Exams",
      });
      if (user.role === "teacher") {
        items.push({
          href: "/admin/teacher-management",
          icon: Users,
          label: "Student & Assistant Management",
        });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">
                  Admin Dashboard
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}