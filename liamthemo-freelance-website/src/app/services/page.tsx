import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Eyebrow from "@/components/Eyebrow";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/services";

/*
  Overview of all five service lines. Fully static: it reads a typed module at
  build time and nothing else, so it prerenders and never invokes the Worker
  (§4.1).

  There is no per-service markup anywhere in this file. Adding a sixth service
  means adding one object to services.ts; this page picks it up with no edit.
*/

export const metadata: Metadata = {
  title: "Services",
  description:
    "Automation, spreadsheets and data, websites, local tech help around Calgary, and Roblox development for individuals and small businesses.",
  openGraph: {
    type: "website",
    title: "Services",
    description:
      "Automation, spreadsheets and data, websites, local tech help around Calgary, and Roblox development.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20 sm:pb-16">
        <Eyebrow>Services</Eyebrow>
        <h1 className="mt-3 max-w-[18ch] text-h1 text-ink">
          Five ways I can save you time
        </h1>
        <p className="mt-4 max-w-[54ch] text-body text-ink-muted">
          Pick whichever sounds closest to your situation. If none of them quite
          fit, that is worth a message anyway.
        </p>
      </section>

      <section
        aria-label="All services"
        className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </section>

      <CTASection />
    </>
  );
}
