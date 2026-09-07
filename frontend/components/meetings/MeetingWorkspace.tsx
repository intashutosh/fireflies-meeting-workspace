"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MoreHorizontal,
  Users,
} from "lucide-react";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Meeting } from "@/types/meeting";

import ActionItems from "./ActionItems";
import TranscriptPanel from "./TranscriptPanel";
import AudioPlayer from "./AudioPlayer";

interface MeetingWorkspaceProps {
  meeting: Meeting;
}

export default function MeetingWorkspace({
  meeting,
}: MeetingWorkspaceProps) {
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [actionItems, setActionItems] = useState(
    meeting.action_items
  );

  const durationMinutes = Math.floor(
    meeting.duration_seconds / 60
  );

  const meetingDate = new Date(meeting.date);

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => router.push("/")}
              className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to meetings
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">
              {meeting.title}
            </h1>

            <div className="mt-3 flex items-center gap-5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} />
                {meetingDate.toLocaleDateString()}
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
          </div>

          <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Main workspace */}
      <main className="grid min-h-0 flex-1 grid-cols-2">
        {/* Left panel */}
        <section className="overflow-y-auto border-r border-gray-200 p-8">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Summary
          </h2>

          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm leading-6 text-gray-600">
              {meeting.summary ||
                "No summary available for this meeting."}
            </p>
          </div>

          {/* Topics */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Topics
            </h2>

            <div className="space-y-3">
              {meeting.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-medium text-gray-900">
                    {topic.title}
                  </p>

                  {topic.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {topic.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action items component */}
<ActionItems
  meetingId={meeting.id}
  items={actionItems}
  onChange={setActionItems}
/>
        </section>

        {/* Right panel - Transcript Component */}
        <TranscriptPanel
          segments={meeting.transcript_segments}
          currentTime={currentTime}
          onSeek={(time) => {
            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }

            setCurrentTime(time);
          }}
        />
      </main>

      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Audio player */}
      <AudioPlayer
        duration={meeting.duration_seconds}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTimeChange={(time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
          }

          setCurrentTime(time);
        }}
        onTogglePlay={() => {
          if (!audioRef.current) return;

          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
        }}
      />
    </div>
  );
}