"use client";

import {
  Pause,
  Play,
  Volume2,
} from "lucide-react";

interface AudioPlayerProps {
  duration: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
}

export default function AudioPlayer({
  duration,
  currentTime,
  onTimeChange,
  onTogglePlay,
  isPlaying,
}: AudioPlayerProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0
    ? duration
    : 0;

  const safeCurrentTime = Math.min(
    Math.max(currentTime, 0),
    safeDuration || currentTime
  );

  const progress =
    safeDuration > 0
      ? Math.min((safeCurrentTime / safeDuration) * 100, 100)
      : 0;

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.03)] lg:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4">
        {/* Play / pause */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
          aria-label={isPlaying ? "Pause recording" : "Play recording"}
        >
          {isPlaying ? (
            <Pause size={17} />
          ) : (
            <Play size={17} className="ml-0.5" />
          )}
        </button>

        {/* Current time */}
        <span className="hidden w-12 text-sm tabular-nums text-gray-500 sm:block">
          {formatTime(safeCurrentTime)}
        </span>

        {/* Progress */}
        <input
          type="range"
          min="0"
          max={safeDuration || 1}
          step="0.1"
          value={safeCurrentTime}
          onChange={(event) =>
            onTimeChange(Number(event.target.value))
          }
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(
              to right,
              #6d5dfc ${progress}%,
              #e5e7eb ${progress}%
            )`,
          }}
          aria-label="Audio progress"
        />

        {/* Duration */}
        <span className="w-12 text-right text-sm tabular-nums text-gray-500">
          {formatTime(safeDuration)}
        </span>

        <Volume2
          size={18}
          className="hidden text-gray-400 sm:block"
        />
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}