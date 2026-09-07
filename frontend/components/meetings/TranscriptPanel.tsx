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
    if (!search.trim()) {
      return segments;
    }

    const query = search.toLowerCase();

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
    <section className="flex min-h-0 flex-1 flex-col">
      {/* Transcript header */}
      <div className="border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transcript
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {segments.length} segments
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
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div className="min-h-0 flex-1 overflow-y-auto p-8">
        {filteredSegments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              No transcript matches found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSegments.map((segment) => {
              const isActive = activeSegment?.id === segment.id;

              return (
                <div
                  key={segment.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => onSeek(segment.start_time)}
                  className={`cursor-pointer rounded-xl p-4 transition ${
                    isActive
                      ? "bg-purple-50 ring-1 ring-purple-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {segment.speaker.name}
                    </span>

                    <span className="text-xs text-gray-400">
                      {formatTime(segment.start_time)}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-gray-600">
                    <HighlightedText
                      text={segment.text}
                      query={search}
                    />
                  </p>
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
            className="rounded bg-yellow-200 px-0.5"
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

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}