"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import MeetingCard from "./MeetingCard";
import CreateMeetingModal from "./CreateMeetingModal";
import Toast from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api";
import type { MeetingListItem } from "@/types/meeting";

type SortOption = "newest" | "oldest";
type DateFilter = "all" | "today" | "7days" | "30days";

export default function MeetingsLibrary() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [participantFilter, setParticipantFilter] =
    useState("all");
  const [dateFilter, setDateFilter] =
    useState<DateFilter>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function loadMeetings() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch<MeetingListItem[]>(
          "/api/meetings"
        );

        setMeetings(data);
      } catch (err) {
        console.error("Failed to load meetings:", err);
        setError(
          "Unable to load meetings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMeetings();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  const participants = useMemo(() => {
    return Array.from(
      new Map(
        meetings
          .flatMap((meeting) => meeting.participants)
          .map((participant) => [
            participant.id,
            participant,
          ])
      ).values()
    ).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const now = new Date();

    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.date);

        const matchesSearch =
          !searchText ||
          meeting.title
            .toLowerCase()
            .includes(searchText) ||
          meeting.participants.some((participant) =>
            participant.name
              .toLowerCase()
              .includes(searchText)
          );

        const matchesParticipant =
          participantFilter === "all" ||
          meeting.participants.some(
            (participant) =>
              participant.id.toString() ===
              participantFilter
          );

        let matchesDate = true;

        if (dateFilter === "today") {
          matchesDate =
            meetingDate.toDateString() ===
            now.toDateString();
        }

        if (dateFilter === "7days") {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(
            now.getDate() - 7
          );

          matchesDate =
            meetingDate >= sevenDaysAgo &&
            meetingDate <= now;
        }

        if (dateFilter === "30days") {
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(
            now.getDate() - 30
          );

          matchesDate =
            meetingDate >= thirtyDaysAgo &&
            meetingDate <= now;
        }

        return (
          matchesSearch &&
          matchesParticipant &&
          matchesDate
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sort === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [
    meetings,
    search,
    participantFilter,
    dateFilter,
    sort,
  ]);

  const hasFilters =
    search.trim().length > 0 ||
    participantFilter !== "all" ||
    dateFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setParticipantFilter("all");
    setDateFilter("all");
    setSort("newest");
  };

  const handleDelete = async (meetingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(
        `/api/meetings/${meetingId}`,
        {
          method: "DELETE",
        }
      );

      setMeetings((currentMeetings) =>
        currentMeetings.filter(
          (meeting) => meeting.id !== meetingId
        )
      );

      setToast({
        message: "Meeting deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error(
        "Failed to delete meeting:",
        err
      );

      setToast({
        message: "Failed to delete meeting",
        type: "error",
      });
    }
  };

  const handleCreated = (
    meeting: MeetingListItem
  ) => {
    setMeetings((currentMeetings) => [
      meeting,
      ...currentMeetings,
    ]);

    setToast({
      message: "Meeting created successfully",
      type: "success",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Meetings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Browse and manage your meeting recordings
              and notes.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setCreateModalOpen(true)
            }
            className="flex items-center gap-2 rounded-lg bg-[#6d5dfc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5c4ded]"
          >
            <Plus size={17} />
            New meeting
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-8 py-6">
        {/* Toolbar */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search meetings or participants..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-1 text-sm text-gray-500">
                <SlidersHorizontal size={15} />
                Filters
              </div>

              <select
                value={participantFilter}
                onChange={(event) =>
                  setParticipantFilter(
                    event.target.value
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6d5dfc]"
              >
                <option value="all">
                  All participants
                </option>

                {participants.map(
                  (participant) => (
                    <option
                      key={participant.id}
                      value={participant.id}
                    >
                      {participant.name}
                    </option>
                  )
                )}
              </select>

              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(
                    event.target.value as DateFilter
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6d5dfc]"
              >
                <option value="all">
                  All dates
                </option>
                <option value="today">
                  Today
                </option>
                <option value="7days">
                  Last 7 days
                </option>
                <option value="30days">
                  Last 30 days
                </option>
              </select>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as SortOption
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6d5dfc]"
              >
                <option value="newest">
                  Newest first
                </option>
                <option value="oldest">
                  Oldest first
                </option>
              </select>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={16} />

            <span>
              {filteredMeetings.length}{" "}
              {filteredMeetings.length === 1
                ? "meeting"
                : "meetings"}
            </span>
          </div>

          {hasFilters && !loading && (
            <span className="text-xs text-gray-400">
              Filters applied
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              )
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty database */}
        {!loading &&
          !error &&
          meetings.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1efff]">
                <CalendarDays
                  size={21}
                  className="text-[#6d5dfc]"
                />
              </div>

              <h2 className="mt-4 text-base font-semibold text-gray-900">
                No meetings yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Create your first meeting to start
                building your meeting workspace.
              </p>

              <button
                type="button"
                onClick={() =>
                  setCreateModalOpen(true)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#6d5dfc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5c4ded]"
              >
                <Plus size={17} />
                Create meeting
              </button>
            </div>
          )}

        {/* No results */}
        {!loading &&
          !error &&
          meetings.length > 0 &&
          filteredMeetings.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Search
                  size={20}
                  className="text-gray-500"
                />
              </div>

              <h2 className="mt-4 text-base font-semibold text-gray-900">
                No meetings found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Meeting cards */}
        {!loading &&
          !error &&
          filteredMeetings.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMeetings.map(
                (meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onDelete={handleDelete}
                  />
                )
              )}
            </div>
          )}
      </main>

      {/* Create meeting modal */}
      {createModalOpen && (
        
        <CreateMeetingModal
        open={createModalOpen}
          onClose={() =>
            setCreateModalOpen(false)
          }
          onCreated={handleCreated}
        />
      )}

      {/* Toast */}
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