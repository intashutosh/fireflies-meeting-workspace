"use client";

import { useEffect, useState } from "react";
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
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(meeting.title);
  const [date, setDate] = useState(formatDateForInput(meeting.date));
  const [duration, setDuration] = useState(
    Math.floor(meeting.duration_seconds / 60).toString()
  );
  const [summary, setSummary] = useState(
    meeting.summary ?? ""
  );

  useEffect(() => {
    setTitle(meeting.title);
    setDate(formatDateForInput(meeting.date));
    setDuration(
      Math.floor(meeting.duration_seconds / 60).toString()
    );
    setSummary(meeting.summary ?? "");
  }, [meeting]);

  const openEditModal = () => {
    setTitle(meeting.title);
    setDate(formatDateForInput(meeting.date));
    setDuration(
      Math.floor(meeting.duration_seconds / 60).toString()
    );
    setSummary(meeting.summary ?? "");

    setMenuOpen(false);
    setEditing(true);
  };

  const closeEditModal = () => {
    if (saving) {
      return;
    }

    setEditing(false);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const durationMinutes = Number(duration);

    if (!trimmedTitle) {
      window.alert("Meeting title cannot be empty.");
      return;
    }

    if (
      !Number.isFinite(durationMinutes) ||
      durationMinutes < 0
    ) {
      window.alert("Duration must be a valid number of minutes.");
      return;
    }

    if (!date) {
      window.alert("Please select a meeting date.");
      return;
    }

    try {
      setSaving(true);

      const updatedMeeting = await apiFetch<Meeting>(
        `/api/meetings/${meeting.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: trimmedTitle,
            date: new Date(date).toISOString(),
            duration_seconds: Math.round(
              durationMinutes * 60
            ),
            summary: summary.trim() || null,
          }),
        }
      );

      onUpdated(updatedMeeting);
      setEditing(false);
    } catch (error) {
      console.error(
        "Failed to update meeting:",
        error
      );

      window.alert(
        "Failed to update meeting. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await apiFetch(
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

      window.alert(
        "Failed to delete meeting. Please try again."
      );

      setDeleting(false);
    }
  };

  return (
    <>
      {/* Actions menu */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          aria-label="Meeting actions"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={19} />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setMenuOpen(false)}
            />

            <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
              <button
                type="button"
                onClick={openEditModal}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <Pencil size={16} />
                Edit meeting
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void handleDelete();
                }}
                disabled={deleting}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />
                {deleting
                  ? "Deleting..."
                  : "Delete meeting"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-meeting-title"
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2
                  id="edit-meeting-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Edit meeting
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the meeting metadata.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close edit meeting modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 px-6 py-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="meeting-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Meeting title
                </label>

                <input
                  id="meeting-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/10"
                  placeholder="Enter meeting title"
                />
              </div>

              {/* Date + duration */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="meeting-date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>

                  <input
                    id="meeting-date"
                    type="datetime-local"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="meeting-duration"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Duration (minutes)
                  </label>

                  <input
                    id="meeting-duration"
                    type="number"
                    min="0"
                    step="1"
                    value={duration}
                    onChange={(event) =>
                      setDuration(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/10"
                    placeholder="45"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label
                  htmlFor="meeting-summary"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Summary
                </label>

                <textarea
                  id="meeting-summary"
                  value={summary}
                  onChange={(event) =>
                    setSummary(event.target.value)
                  }
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-6 text-gray-900 outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/10"
                  placeholder="Add a meeting summary..."
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="rounded-lg bg-[#6d5dfc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c4ded] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function formatDateForInput(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const localDate = new Date(
    parsedDate.getTime() -
      parsedDate.getTimezoneOffset() * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}