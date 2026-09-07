"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

interface MeetingActionsProps {
  meeting: Meeting;
  onUpdated: (meeting: Meeting) => void;
}

export default function MeetingActions({
  meeting,
  onUpdated,
}: MeetingActionsProps) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState(meeting.title);
  const [summary, setSummary] = useState(
    meeting.summary || ""
  );

  async function handleUpdate() {
    if (!title.trim()) return;

    try {
      const updatedMeeting =
        await apiFetch<Meeting>(
          `/api/meetings/${meeting.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              title: title.trim(),
              summary: summary.trim() || null,
            }),
          }
        );

      onUpdated(updatedMeeting);
      setEditing(false);
      setMenuOpen(false);
    } catch (error) {
      console.error(
        "Failed to update meeting:",
        error
      );
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await apiFetch<void>(
        `/api/meetings/${meeting.id}`,
        {
          method: "DELETE",
        }
      );

      router.push("/");
    } catch (error) {
      console.error(
        "Failed to delete meeting:",
        error
      );

      setDeleting(false);
    }
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Meeting options"
        >
          <MoreHorizontal size={20} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-20 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setEditing(true);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Pencil size={15} />
              Edit meeting
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={15} />
              {deleting ? "Deleting..." : "Delete meeting"}
            </button>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit meeting
              </h2>

              <button
                onClick={() => setEditing(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Meeting title
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Summary
                </label>

                <textarea
                  value={summary}
                  onChange={(event) =>
                    setSummary(event.target.value)
                  }
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={!title.trim()}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}