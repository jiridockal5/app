"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "Financial dashboard", href: "/", icon: "🏠" },
  { name: "Business dashboard & SaaS", href: "/business", icon: "📈" },
  { name: "Revenue", href: "/revenue", icon: "💰" },
  { name: "Expenses", href: "/expenses", icon: "💸" },
  { name: "People", href: "/people", icon: "👥" },
  { name: "Plan", href: "/plan", icon: "📊" },
];

// Helper to check if pathname matches (handles root path)
const isActivePath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo/Branding */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white text-sm">
              B
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Budget Tool</div>
              <div className="text-xs text-slate-400">saas-planner.com</div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Budget Tool (Site)</span>
            <button className="text-slate-400 hover:text-white">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
          <div className="mt-1 text-slate-500">Europe/Prague (CET)</div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Go to"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-slate-600"
          />
          <span className="absolute right-2 top-2 text-xs text-slate-400">Ctrl K</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help & User */}
      <div className="p-4 border-t border-slate-700 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Need Help?</span>
          <button className="text-slate-400 hover:text-white">⋯</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              U
            </div>
            <span className="text-sm text-slate-300">User</span>
          </div>
          <button className="text-slate-400 hover:text-white">⋯</button>
        </div>
      </div>
    </aside>
  );
}

