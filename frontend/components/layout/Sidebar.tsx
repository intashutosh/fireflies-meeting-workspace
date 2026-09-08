"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckSquare,
  ChevronDown,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Radio,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const [comingSoon, setComingSoon] = useState<{
    title: string;
    description: string;
  } | null>(null);

  return (
    <>
      <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6d5dfc] text-sm font-bold text-white">
              F
            </div>

            <span className="text-[17px] font-semibold tracking-tight text-gray-900">
              Fireflies
            </span>
          </button>
        </div>

        {/* Workspace */}
        <div className="px-3 pt-4">
          <button
            type="button"
            onClick={() =>
              setComingSoon({
                title: "Workspace Switcher",
                description:
                  "Multi-workspace management and organization switching is coming soon.",
              })
            }
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-gray-50"
          >
            <div>
              <p className="text-xs font-medium text-gray-400">WORKSPACE</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800">
                My Workspace
              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Live Bot / Integrations Banner */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() =>
              setComingSoon({
                title: "Live Bot & Integrations",
                description:
                  "Real-time call recording and live transcription for Zoom, Google Meet, and Microsoft Teams is coming soon.",
              })
            }
            className="group flex w-full flex-col rounded-xl border border-purple-200/80 bg-gradient-to-b from-[#f8f7ff] to-white p-3 text-left shadow-sm transition hover:border-[#6d5dfc]/40 hover:shadow"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#6d5dfc]">
                <Radio size={13} className="text-[#6d5dfc]" />
                Live Bot
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-[#6d5dfc]">
                Coming Soon
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-gray-800">
              Add Fireflies to Zoom / Google Meet
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500">
              Connect live meetings
            </p>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex w-full items-center gap-3 rounded-lg bg-[#f0edff] px-3 py-2.5 text-sm font-medium text-[#5b4ee8] transition"
            >
              <LayoutDashboard className="h-[18px] w-[18px]" />
              Meetings
            </button>

            <button
              type="button"
              onClick={() =>
                setComingSoon({
                  title: "My Tasks",
                  description:
                    "Consolidated personal action items and task tracking across all meetings is coming soon.",
                })
              }
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <CheckSquare className="h-[18px] w-[18px]" />
              My Tasks
            </button>
          </div>
        </nav>

        {/* More */}
        <nav className="mt-5 px-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            More
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() =>
                setComingSoon({
                  title: "Team Collaboration",
                  description:
                    "Team sharing, member permissions, and shared meeting channels are coming soon.",
                })
              }
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <Users className="h-[18px] w-[18px]" />
              Team
            </button>

            <button
              type="button"
              onClick={() =>
                setComingSoon({
                  title: "Meeting Templates",
                  description:
                    "Custom note formats, recurring agenda structures, and prompt templates are coming soon.",
                })
              }
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <FileText className="h-[18px] w-[18px]" />
              Templates
            </button>
          </div>
        </nav>

        {/* Bottom */}
        <div className="mt-auto border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={() =>
              setComingSoon({
                title: "Help & Support",
                description:
                  "Knowledge base documentation, video guides, and support chat are coming soon.",
              })
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <HelpCircle className="h-[18px] w-[18px]" />
            Help
          </button>

          <button
            type="button"
            onClick={() =>
              setComingSoon({
                title: "Workspace Settings",
                description:
                  "Preferences, audio devices, notification settings, and API integrations are coming soon.",
              })
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </button>

          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
              S
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">
                Ashutosh
              </p>
              <p className="truncate text-xs text-gray-400">
                Personal workspace
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setComingSoon({
                  title: "Notifications",
                  description:
                    "In-app notifications and meeting alerts are coming soon.",
                })
              }
              className="text-gray-400 hover:text-gray-600"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Coming Soon Dialog */}
      {comingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1efff] text-[#6d5dfc]">
                <Sparkles size={20} />
              </div>

              <button
                type="button"
                onClick={() => setComingSoon(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                {comingSoon.title}
              </h3>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-[#6d5dfc]">
                Coming Soon
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-600">
              {comingSoon.description}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setComingSoon(null)}
                className="rounded-lg bg-[#6d5dfc] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c4ded]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
