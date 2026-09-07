import AppShell from "@/components/layout/AppShell";
import MeetingsLibrary from "@/components/meetings/MeetingsLibrary";

export default function HomePage() {
  return (
    <AppShell>
      <MeetingsLibrary />
    </AppShell>
  );
}