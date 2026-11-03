import { Link } from "@tanstack/react-router";
import { Camera, Settings } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Booth", icon: Camera },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
      <header className="hidden border-b border-border px-6 py-4 md:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <span className="type-h3">Open Booth</span>
          <nav className="flex items-center gap-2">
            {tabs.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="btn-secondary hover:border-secondary hover:bg-secondary/8"
                activeProps={{ className: "border-primary bg-primary/8 text-primary" }}
                activeOptions={{ exact: to === "/" }}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="animate-screen-enter mx-auto w-full max-w-[1200px] px-4 md:px-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex h-[calc(56px+env(safe-area-inset-bottom))] items-start border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex h-14 flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon size={20} />
            <span className="type-caption">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
