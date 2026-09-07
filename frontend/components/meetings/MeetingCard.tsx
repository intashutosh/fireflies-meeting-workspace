"use client";

import Link from "next/link";
import { CalendarDays, Clock, MoreHorizontal, Users } from "lucide-react";
import type { MeetingListItem } from "@/types/meeting";

interface MeetingCardProps {
  meeting: MeetingListItem;
  onDelete: (meetingId: number) => void;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MeetingCard({
  meeting,
  onDelete,
}: MeetingCardProps) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm">
      <Link
        href={`/meetings/${meeting.id}`}
        className="block"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1efff]">
            <CalendarDays
              size={19}
              className="text-[#6d5dfc]"
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete(meeting.id);
            }}
            className="rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
            aria-label="Delete meeting"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
          {meeting.title}
        </h3>

        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatDate(meeting.date)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {formatDuration(meeting.duration_seconds)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={15} />
            {meeting.participants.length} participants
          </div>

          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 4).map((participant) => (
              <div
                key={participant.id}
                title={participant.name}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-semibold text-gray-700"
              >
                {getInitials(participant.name)}
              </div>
            ))}

            {meeting.participants.length > 4 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-semibold text-gray-500">
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}