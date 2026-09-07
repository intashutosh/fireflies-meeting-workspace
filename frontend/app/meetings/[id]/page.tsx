"use client";


import MeetingWorkspace from "@/components/meetings/MeetingWorkspace";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();

  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeeting() {
      try {
        setLoading(true);

        const data = await apiFetch<Meeting>(
          `/api/meetings/${meetingId}`
        );

        setMeeting(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load meeting"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMeeting();
  }, [meetingId]);

  if (loading) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-gray-500">Loading meeting...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !meeting) {
    return (
      <AppShell>
        <div className="p-8">
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to meetings
          </button>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">
              {error || "Meeting not found"}
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
  <AppShell>
    <MeetingWorkspace
  meeting={meeting}
  onUpdated={setMeeting}
/>
  </AppShell>
);
}