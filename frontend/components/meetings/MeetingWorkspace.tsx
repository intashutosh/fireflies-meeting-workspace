"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Meeting } from "@/types/meeting";

import MeetingActions from "./MeetingActions";
import ActionItems from "./ActionItems";
import TranscriptPanel from "./TranscriptPanel";
import AudioPlayer from "./AudioPlayer";

interface MeetingWorkspaceProps {
  meeting: Meeting;
  onUpdated: (meeting: Meeting) => void;
}

export default function MeetingWorkspace({
  meeting,
  onUpdated,
}: MeetingWorkspaceProps) {
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioDuration, setAudioDuration] = useState(
    meeting.duration_seconds
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [actionItems, setActionItems] = useState(
    meeting.action_items
  );

  const durationMinutes = Math.floor(
    meeting.duration_seconds / 60
  );

  const meetingDate = new Date(meeting.date);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }

    setCurrentTime(time);
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#fafafa]">
      {/* Meeting header */}
      <header className="shrink-0 border-b border-gray-200 bg-white px-8 py-5">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to meetings
            </button>

            <h1 className="truncate text-2xl font-semibold tracking-tight text-gray-900">
              {meeting.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} />
                {meetingDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={15} />
                {durationMinutes} min
              </div>

              <div className="flex items-center gap-2">
                <Users size={15} />
                {meeting.participants.length} participants
              </div>
            </div>

            {/* Participant avatars */}
            <div className="mt-4 flex items-center">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 6).map((participant) => (
                  <div
                    key={participant.id}
                    title={participant.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-semibold text-gray-700"
                  >
                    {getInitials(participant.name)}
                  </div>
                ))}
              </div>

              {meeting.participants.length > 6 && (
                <span className="ml-3 text-xs text-gray-400">
                  +{meeting.participants.length - 6} more
                </span>
              )}
            </div>
          </div>

          <MeetingActions
            meeting={meeting}
            onUpdated={onUpdated}
          />
        </div>
      </header>

      {/* Main workspace */}
      <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Left information panel */}
        <section className="min-h-0 overflow-y-auto border-r border-gray-200 bg-white p-8">
          {/* Summary */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Summary
              </h2>

              <span className="rounded-full bg-[#f1efff] px-2.5 py-1 text-xs font-medium text-[#6d5dfc]">
                AI summary
              </span>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-5">
              <p className="text-sm leading-7 text-gray-600">
                {meeting.summary ||
                  "No summary available for this meeting."}
              </p>
            </div>
          </div>

          {/* Topics */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Topics
              </h2>

              <span className="text-xs text-gray-400">
                {meeting.topics.length} topics
              </span>
            </div>

            {meeting.topics.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                <p className="text-sm text-gray-500">
                  No topics available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {meeting.topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {topic.title}
                        </p>

                        {topic.description && (
                          <p className="mt-1.5 text-sm leading-6 text-gray-500">
                            {topic.description}
                          </p>
                        )}

                        {topic.timestamp !== null && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSeek(topic.timestamp ?? 0)
                            }
                            className="mt-2 text-xs font-medium text-[#6d5dfc] hover:underline"
                          >
                            Jump to {formatTime(topic.timestamp)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action items */}
          <ActionItems
            meetingId={meeting.id}
            items={actionItems}
            onChange={setActionItems}
          />
        </section>

        {/* Transcript */}
        <TranscriptPanel
          segments={meeting.transcript_segments}
          currentTime={currentTime}
          onSeek={handleSeek}
        />
      </main>

      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src="/audio/demo-meeting.mp3"
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Persistent audio player */}
      <AudioPlayer
        duration={audioDuration}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTimeChange={handleSeek}
        onTogglePlay={handleTogglePlay}
      />
    </div>
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

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}