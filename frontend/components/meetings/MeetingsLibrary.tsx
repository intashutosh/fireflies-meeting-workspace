"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Toast from "@/components/ui/Toast";
import CreateMeetingModal from "./CreateMeetingModal";
import { apiFetch } from "@/lib/api";
import type { MeetingListItem } from "@/types/meeting";

import MeetingCard from "./MeetingCard";

type SortOption = "newest" | "oldest";

export default function MeetingsLibrary() {
    const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error";
} | null>(null);
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [createModalOpen, setCreateModalOpen] =
  useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeetings() {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch<MeetingListItem[]>(
          "/api/meetings"
        );

        setMeetings(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load meetings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);
const handleDelete = async (meetingId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this meeting?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await apiFetch(`/api/meetings/${meetingId}`, {
      method: "DELETE",
    });

    setMeetings((currentMeetings) =>
      currentMeetings.filter((meeting) => meeting.id !== meetingId)
    );

    setToast({
      message: "Meeting deleted successfully",
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  } catch (error) {
    console.error("Failed to delete meeting:", error);

    setToast({
      message: "Failed to delete meeting",
      type: "error",
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }
};
  const filteredMeetings = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = meetings;

    if (query) {
      result = meetings.filter((meeting) => {
        const titleMatch = meeting.title
          .toLowerCase()
          .includes(query);

        const participantMatch = meeting.participants.some(
          (participant) =>
            participant.name.toLowerCase().includes(query)
        );

        return titleMatch || participantMatch;
      });
    }

    return [...result].sort((a, b) => {
      const first = new Date(a.date).getTime();
      const second = new Date(b.date).getTime();

      return sort === "newest"
        ? second - first
        : first - second;
    });
  }, [meetings, search, sort]);

  return (
    <div className="h-screen overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-[#fafafa]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Meetings
            </h1>

            <p className="mt-0.5 text-xs text-gray-500">
              Your conversations and meeting notes
            </p>
          </div>

          <button
  onClick={() => setCreateModalOpen(true)}
  className="flex items-center gap-2 rounded-lg bg-[#6d5dfc] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#5f50ed]">
            <Plus className="h-4 w-4" />
  New meeting
</button>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-7 lg:px-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search meetings or participants..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#8b80f8] focus:ring-2 focus:ring-[#6d5dfc]/10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as SortOption
                  )
                }
                className="h-10 appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-9 text-sm font-medium text-gray-600 outline-none hover:bg-gray-50"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              className="hidden h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:flex"
              aria-label="View settings"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-7 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {search
              ? `${filteredMeetings.length} results`
              : `${meetings.length} meetings`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-3 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-[82px] animate-pulse rounded-xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-800">
              Unable to load meetings
            </p>

            <p className="mt-1 text-sm text-red-600">
              Make sure the FastAPI backend is running.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredMeetings.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-gray-900">
                No meetings found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}

        {/* Meetings */}
        {!loading &&
          !error &&
          filteredMeetings.length > 0 && (
            <div className="mt-3 space-y-2.5">
              {filteredMeetings.map((meeting) => (
  <MeetingCard
    key={meeting.id}
    meeting={meeting}
    onDelete={handleDelete}
  />
))}
            </div>
          )}
      </div>
      <CreateMeetingModal
  open={createModalOpen}
  onClose={() => setCreateModalOpen(false)}
  onCreated={(meeting) => {
    setCreateModalOpen(false);

    setMeetings((currentMeetings) => [
      {
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        duration_seconds: meeting.duration_seconds,
        summary: meeting.summary,
        participants: meeting.participants,
      },
      ...currentMeetings,
    ]);
  }}
/>

  {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
    </div>
  );
}