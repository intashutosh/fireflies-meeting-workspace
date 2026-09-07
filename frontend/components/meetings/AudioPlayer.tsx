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
  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  return (
    <div className="border-t border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={17} />
          ) : (
            <Play size={17} />
          )}
        </button>

        <span className="w-12 text-sm tabular-nums text-gray-500">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={(event) =>
            onTimeChange(Number(event.target.value))
          }
          className="h-1 flex-1 cursor-pointer"
          style={{
            background: `linear-gradient(
              to right,
              #111827 ${progress}%,
              #e5e7eb ${progress}%
            )`,
          }}
          aria-label="Audio progress"
        />

        <span className="w-12 text-right text-sm tabular-nums text-gray-500">
          {formatTime(duration)}
        </span>

        <Volume2
          size={18}
          className="text-gray-400"
        />
      </div>
    </div>
  );
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