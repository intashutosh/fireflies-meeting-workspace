import Link from "next/link";
import { CalendarDays, Clock, MoreHorizontal, Users } from "lucide-react";

import type { MeetingListItem } from "@/types/meeting";

interface MeetingCardProps {
  meeting: MeetingListItem;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

const avatarClasses = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

export default function MeetingCard({
  meeting,
}: MeetingCardProps) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group block rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-5 px-5 py-4">
        {/* Meeting icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f0edff] text-[#6558e8]">
          <CalendarDays className="h-5 w-5" />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-[#5b4ee8]">
            {meeting.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(meeting.date)}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(meeting.duration_seconds)}
            </span>

            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {meeting.participants.length}
            </span>
          </div>
        </div>

        {/* Participants */}
        <div className="hidden items-center sm:flex">
          {meeting.participants
            .slice(0, 4)
            .map((participant, index) => (
              <div
                key={participant.id}
                title={participant.name}
                className={`-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold first:ml-0 ${
                  avatarClasses[index % avatarClasses.length]
                }`}
              >
                {getInitials(participant.name)}
              </div>
            ))}

          {meeting.participants.length > 4 && (
            <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-semibold text-gray-500">
              +{meeting.participants.length - 4}
            </div>
          )}
        </div>

        {/* More button */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Meeting options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}