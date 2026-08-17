import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Eyebrow from "@/components/Eyebrow";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

/*
  Portfolio index (CLAUDE.md §5, §14 step 4). Fully static: it only reads
  `projects`, a build-time constant, so it prerenders and is served from the
  assets binding without invoking the Worker (§4.1).
*/

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Real automation, spreadsheet and Roblox work — the problem, what was built, and what changed.",
  openGraph: {
    type: "website",
    title: "Portfolio",
    description:
      "Real automation, spreadsheet and Roblox work — the problem, what was built, and what changed.",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow>Real work</Eyebrow>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="max-w-[20ch] text-h1 text-ink">Portfolio</h1>
            <span className="rounded-full border border-line px-2.5 py-1 text-small font-medium text-ink-muted">
              WIP
            </span>
          </div>
          <p className="mt-4 max-w-[56ch] text-body text-ink-muted">
            A look at finished work: what the problem was, what got built, and
            what changed because of it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ul>
      </section>

      {/*
        There's no /services index to link a "Browse services" secondary CTA
        to anymore — the triage widget on the home page is the de facto
        services index now, so that's where this points.
      */}
      <CTASection secondary={{ href: "/", label: "Browse services" }} />
    </>
  );
}
