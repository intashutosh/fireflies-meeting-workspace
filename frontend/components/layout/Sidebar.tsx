"use client";

import {
  Bell,
  CheckSquare,
  ChevronDown,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  {
    label: "Meetings",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "My Tasks",
    icon: CheckSquare,
    active: false,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-100 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6d5dfc] text-sm font-bold text-white">
            F
          </div>

          <span className="text-[17px] font-semibold tracking-tight text-gray-900">
            Fireflies
          </span>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-3 pt-5">
        <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-gray-50">
          <div>
            <p className="text-xs font-medium text-gray-400">WORKSPACE</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">
              My Workspace
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5 px-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  item.active
                    ? "bg-[#f0edff] text-[#5b4ee8]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* More */}
      <nav className="mt-7 px-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          More
        </p>

        <div className="space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
            <Users className="h-[18px] w-[18px]" />
            Team
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
            <FileText className="h-[18px] w-[18px]" />
            Templates
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-gray-100 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50">
          <HelpCircle className="h-[18px] w-[18px]" />
          Help
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50">
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </button>

        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
            S
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800">
              Suyash
            </p>
            <p className="truncate text-xs text-gray-400">
              Personal workspace
            </p>
          </div>

          <Bell className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}