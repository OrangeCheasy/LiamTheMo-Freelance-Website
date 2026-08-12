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
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Site under construction
        </h1>
        <p className="mt-4 text-base leading-7 opacity-70">
          Automation, spreadsheets, websites, and tech help for individuals and
          small businesses. The full site is on its way.
        </p>
      </div>
    </main>
  );
}
