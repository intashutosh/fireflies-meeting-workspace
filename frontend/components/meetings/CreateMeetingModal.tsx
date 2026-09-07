"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

interface CreateMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (meeting: Meeting) => void;
}

export default function CreateMeetingModal({
  open,
  onClose,
  onCreated,
}: CreateMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Meeting title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const meeting = await apiFetch<Meeting>(
        "/api/meetings",
        {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            date: date
              ? new Date(date).toISOString()
              : new Date().toISOString(),
            duration_seconds:
              Number(duration || 0) * 60,
            summary: summary.trim() || null,
          }),
        }
      );

      if (transcript.trim()) {
  await apiFetch(
    `/api/transcripts/meeting/${meeting.id}/import`,
    {
      method: "POST",
      body: JSON.stringify({
        transcript: transcript.trim(),  
      }),
    }
  );
}

      onCreated(meeting);

      setTitle("");
      setDate("");
      setDuration("");
      setSummary("");
      setTranscript("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create meeting."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create meeting
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a meeting and its transcript.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Meeting title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Product Planning Meeting"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Date + duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                type="datetime-local"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="0"
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value)
                }
                placeholder="30"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Summary
            </label>

            <textarea
              value={summary}
              onChange={(event) =>
                setSummary(event.target.value)
              }
              rows={4}
              placeholder="Brief meeting summary..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Transcript */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Transcript
            </label>

            <textarea
              value={transcript}
              onChange={(event) =>
                setTranscript(event.target.value)
              }
              rows={10}
              placeholder={`Paste transcript here...

Sarah: Let's discuss the product roadmap.
John: I think we should prioritize...
Sarah: Agreed.`}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-gray-400"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Speaker names can be written as:
              <br />
              <span className="font-mono">
                Sarah: Hello everyone.
              </span>
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}