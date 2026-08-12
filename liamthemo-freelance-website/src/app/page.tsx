import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under construction",
  description: "This site is being built. Check back soon.",
  // Keep the placeholder out of search results. Remove this once there is real
  // content to index — see DEPLOYMENT.md §6 for why this matters.
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    // The layout now owns <main>, so this only supplies the content inside it.
    <div className="flex items-center justify-center px-5 py-24 sm:px-8">
      <div className="max-w-md text-center">
        <h1 className="text-h1">Site under construction</h1>
        <p className="mt-4 text-body text-ink-muted">
          Automation, spreadsheets, websites, and tech help for individuals and
          small businesses. The full site is on its way.
        </p>
      </div>
    </div>
  );
}
