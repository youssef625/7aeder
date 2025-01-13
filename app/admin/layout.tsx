"use client";

import { Users, BookOpen, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
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
                <Link
                  href="/admin/users"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive("/admin/users")
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </Link>
                <Link
                  href="/admin/lectures"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive("/admin/lectures")
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Lecture Management
                </Link>
                <Link
                  href="/admin/attendance"
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                    isActive("/admin/attendance")
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Attendance
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/admin/users"
              className={`${
                isActive("/admin/users")
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
            >
              <Users className="h-5 w-5 mr-2" />
              User Management
            </Link>
            <Link
              href="/admin/lectures"
              className={`${
                isActive("/admin/lectures")
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Lecture Management
            </Link>
            <Link
              href="/admin/attendance"
              className={`${
                isActive("/admin/attendance")
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
            >
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Attendance
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
