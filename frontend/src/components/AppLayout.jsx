import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

/** Shared shell: sticky navbar + centered, padded content container. */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-400 dark:border-slate-800/70">
        ReleaseCheck · Built with React, Vite &amp; TanStack Query
      </footer>
    </div>
  );
}
