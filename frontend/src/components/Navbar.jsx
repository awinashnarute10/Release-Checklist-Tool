import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { MoonIcon, RocketIcon, SunIcon } from "./icons";

/**
 * Top navigation bar with brand, tagline and dark-mode toggle.
 * Sticky and translucent so content scrolls underneath.
 */
export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <RocketIcon />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              ReleaseCheck
            </span>
            <span className="hidden text-xs text-slate-400 sm:block">
              Your all-in-one release checklist tool
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
