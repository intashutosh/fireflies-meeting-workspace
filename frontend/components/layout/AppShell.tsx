import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}