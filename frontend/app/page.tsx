import AppShell from "@/components/layout/AppShell";

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Meetings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your meeting workspace is ready.
          </p>
        </div>
      </div>
    </AppShell>
  );
}