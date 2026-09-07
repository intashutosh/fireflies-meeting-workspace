"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import type { TranscriptSegment } from "@/types/meeting";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function TranscriptPanel({
  segments,
  currentTime,
  onSeek,
}: TranscriptPanelProps) {
  const [search, setSearch] = useState("");

  const activeRef = useRef<HTMLDivElement | null>(null);

  const activeSegment = segments.find(
    (segment) =>
      currentTime >= segment.start_time &&
      currentTime < segment.end_time
  );

  const filteredSegments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return segments;
    }

    return segments.filter((segment) =>
      segment.text.toLowerCase().includes(query)
    );
  }, [segments, search]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSegment?.id]);

  return (
    <section className="flex min-h-0 flex-col bg-[#fafafa]">
      {/* Transcript header */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transcript
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredSegments.length} of {segments.length} segments
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transcript..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Clear transcript search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Transcript content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        {filteredSegments.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                <Search size={18} className="text-gray-400" />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-700">
                No transcript matches found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Try a different search term.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-2">
            {filteredSegments.map((segment) => {
              const isActive = activeSegment?.id === segment.id;

              return (
                <div
                  key={segment.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => onSeek(segment.start_time)}
                  className={`group cursor-pointer rounded-xl border p-4 transition ${
                    isActive
                      ? "border-purple-200 bg-purple-50 shadow-sm"
                      : "border-transparent hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Speaker avatar */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-[#6d5dfc] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {getInitials(segment.speaker.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {segment.speaker.name}
                        </span>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSeek(segment.start_time);
                          }}
                          className="text-xs tabular-nums text-gray-400 transition hover:text-[#6d5dfc]"
                        >
                          {formatTime(segment.start_time)}
                        </button>
                      </div>

                      <p
                        className={`text-sm leading-7 ${
                          isActive
                            ? "text-gray-700"
                            : "text-gray-600"
                        }`}
                      >
                        <HighlightedText
                          text={segment.text}
                          query={search}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) {
    return text;
  }

  const parts = text.split(
    new RegExp(`(${escapeRegex(query)})`, "gi")
  );

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-yellow-200 px-0.5 text-gray-900"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}