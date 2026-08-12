"use client";

/*
  The second — and last — client component in the layout shell.

  It reads state that lives outside React (an attribute on <html>, localStorage,
  and the OS colour-scheme media query), so it uses useSyncExternalStore rather
  than useState + useEffect. That is the API built for exactly this: it gives a
  server snapshot for the prerender, resubscribes on the client, and avoids the
  setState-inside-an-effect pattern the lint config rejects.

  The server cannot know the visitor's theme, so the prerendered HTML always
  reflects "light" and the icon corrects itself at hydration. The page colours
  themselves do not flash, because the inline script in the root layout sets
  data-theme before first paint.
*/

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

function readTheme(): Theme {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  // `storage` keeps other tabs in sync; the custom event handles this tab.
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing can throw on write. The toggle still works for this
      // page view; it just will not be remembered.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink ${className}`}
    >
      <span className="sr-only">Switch to {next} theme</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        {theme === "dark" ? (
          // Sun — clicking returns to light.
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          // Moon — clicking goes to dark.
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        )}
      </svg>
    </button>
  );
}
