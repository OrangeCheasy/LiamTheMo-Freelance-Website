import type {
  LineIconKey,
  Service,
  ServicePage,
  ServiceSlug,
} from "@/lib/types";

/*
  The five service lines (CLAUDE.md §1). This file is the whole services system:
  /services and /services/[slug] are generated from it, so adding a sixth service
  means adding one object here and nothing else.

  RULES THAT SHAPED THE CONTENT — read before editing.

  `problems` is the most important field on the page. Each line is a SYMPTOM in
  the visitor's own words, first person, describing a Monday morning rather than
  a capability. "I retype the same numbers every week" earns recognition;
  "data entry automation" does not. If an edit here starts sounding like a
  service description, it has gone wrong.

  `startingPrice` and `turnaround` are absent from every entry. That is
  deliberate and required by §10 — the owner has not set prices or delivery
  times, and both fields are optional in the type for exactly this reason.
  Do NOT add "contact for pricing" as a value; omitting the field is the
  supported way to say nothing.

  `faqs` contains only answers the owner has confirmed. A question whose honest
  answer would be a business policy that has not been set is left out rather
  than guessed. Policies that apply to every service live in `commonFaqs` below
  rather than being copied into all five objects.

  NO `relatedProjects` FIELD. It used to hold hand-maintained forward
  references to project slugs, written before projects.ts existed. Removed
  2026-08-21 (resolves the TODO that used to sit here): it had already drifted
  — `excel-data` still pointed at "excel-performance-dashboard", a project
  that has never existed — and nothing read it. `projectsForService()` in
  projects.ts derives the real list from each project's own `services` array
  instead, which cannot drift the same way. See that function's comment.
*/

export const services: readonly Service[] = [
  {
    slug: "automation",
    title: "Automation & Python",
    tagline: "Stop doing the same task by hand every week.",
    icon: "🔄",
    problems: [
      "I retype the same numbers into a spreadsheet every Monday",
      "I download a report, reformat it, and email it out again every day",
      "Moving data between two systems takes an hour and I still make mistakes",
      "I have a folder full of PDFs and I need the numbers out of them",
      "Every file has to be renamed and filed the same way, and I do it by hand",
      "The person who used to do this left, and it was all in their head",
    ],
    deliverables: [
      "A program that does the task from start to finish",
      "A simple way to run it: a shortcut, a scheduled job, or one button",
      "Written instructions in plain language, not developer notes",
      "A walkthrough where you watch it run on your own files",
    ],
    process: [
      "You show me the task the way you do it now",
      "I confirm what I would build, what it costs, and how long it takes",
      "I build it and test it against your real files",
      "I hand it over and show you how to run it yourself",
    ],
    faqs: [
      {
        q: "Do I need to know how to code?",
        a: "No. You run it the way you would open any other program on your computer. Nothing you do day to day changes.",
      },
      {
        q: "What kinds of files can it work with?",
        a: "Spreadsheets, CSV exports, PDFs, and text files. If a system lets you export data or has an API, it can usually be connected directly.",
      },
      {
        q: "What if I only do this task once a month?",
        a: "Then it is probably not worth automating yet. Tell me how long it takes and how often you do it, and I will tell you honestly whether it is worth the money.",
      },
    ],

    /*
      THE ART-DIRECTED PAGE (owner mockup, 2026-08-21). Roblox got its own
      mockup and `page` object on 2026-08-22 (see that object, further down
      this file); the other three still fall through to `servicePage()`
      below, which is what renders when a service has no `page` of its own.

      REGISTER. This page is louder than the rest of the site on purpose: the
      mockup's heading is a claim ("Automation that works for you"), where §11
      normally asks for the outcome in the visitor's own words. The `problems`
      array above still holds that voice, and it is what the quote form and the
      home page's triage cards run on. This copy is the shopfront; that copy is
      the diagnosis.

      NOTHING HERE IS A RESULT CLAIM. No hours saved, no client count, no
      turnaround promise — §11's hard rule, and the reason the panel's three
      points are commitments about how I work rather than numbers.
    */
    page: {
      headline: [
        [{ text: "Automation", accent: true }],
        [{ text: "that works for you." }],
      ],
      blurb:
        "Custom scripts, tools, and systems to automate repetitive work, streamline your workflow, and turn manual tasks into simple, one-click solutions.",
      /*
        "View Examples" points at the portfolio index rather than an on-page
        section: the mockup ends this page at the closing bar, so the related-
        work grid that used to live here is gone (owner call) and this button
        is now the only route from a service page to the proof. Losing that
        link entirely would have made the page a dead end.
      */
      secondaryCta: {
        href: "/portfolio",
        label: "View Examples",
        icon: "window",
      },
      offer: {
        label: "What I Build",
        heading: "Automation for Real-World Use",
        body: "From simple scripts to full systems, I build automation tools that are reliable, easy to use, and tailored to your specific needs.",
        cards: [
          {
            icon: "file",
            title: "Data Processing",
            description: "Clean, organize, and transform your data automatically.",
          },
          {
            icon: "gear",
            title: "Workflow Automation",
            description: "Automate repetitive tasks and save hours every week.",
          },
          {
            icon: "code",
            title: "Custom Scripts",
            description: "Python, JavaScript, Excel VBA, and more.",
          },
          {
            icon: "cloud",
            title: "Integrations",
            description: "Connect your tools and services together.",
          },
          {
            icon: "chart",
            title: "Scalable Solutions",
            description: "Built to grow with your needs.",
          },
        ],
      },
      /*
        Four steps, and they are the same four as `process` above told in the
        second person — Discuss/Plan/Build/Deliver against "You show me the
        task" / "I confirm what I would build" / "I build it and test it" / "I
        hand it over". Deliberately not a fifth stage invented for the mockup:
        a visitor who reads both should find one process described twice, not
        two processes.
      */
      process: {
        label: "My Process",
        heading: "Simple. Clear. Effective.",
        body: "A straightforward process from idea to a working solution.",
        steps: [
          {
            icon: "chat",
            title: "Discuss",
            description: "We go over your goals and pain points.",
          },
          {
            icon: "file",
            title: "Plan",
            description: "I design the right approach for your needs.",
          },
          {
            icon: "code",
            title: "Build",
            description: "I develop and test the solution.",
          },
          {
            icon: "plane",
            title: "Deliver",
            description: "You get a polished, documented system.",
          },
        ],
      },
      /*
        "Fast turnaround" is the one point here that edges toward a promise.
        It stays because it is a description of how I work rather than a
        number — §11 blocks "typically 3-7 days", which is why `turnaround` is
        still absent from this service, not a claim to be quick.
      */
      panel: {
        icon: "bolt",
        heading: "Ready to automate your workflow?",
        points: ["Fast turnaround", "Clear communication", "Ongoing support"],
      },
      closing: {
        title: "Have an idea in mind?",
        description:
          "Tell me what you're trying to automate. I'll get back to you within one business day.",
      },
    },
  },

  {
    slug: "excel-data",
    title: "Excel & Data",
    tagline: "Turn the numbers you already have into something you can read.",
    icon: "📊",
    problems: [
      "My spreadsheet works, but I am the only person who knows how to use it",
      "I need the same report every month and I rebuild it by hand every time",
      "Two spreadsheets disagree and I cannot work out which one is right",
      "Someone typed the dates four different ways and now nothing sorts properly",
      "I have years of sales data and no idea what it is telling me",
      "The file has got so big that it takes a minute to open",
    ],
    deliverables: [
      "A spreadsheet built so that someone other than you can use it",
      "Reports that rebuild themselves when new data goes in",
      "A dashboard showing the few numbers you actually check",
      "Cleaned data, with the duplicates and formatting problems fixed",
    ],
    process: [
      "You send me the spreadsheet you use now",
      "I confirm what I would change, what it costs, and how long it takes",
      "I rebuild it and check the numbers against your originals",
      "I hand it back and walk you through what changed",
    ],
    faqs: [
      {
        q: "Do I have to stop using Excel?",
        a: "No. If Excel already works for you, the job is to make it work better. I would only suggest moving off it if the file has grown to the point where it is slow or breaking.",
      },
      {
        q: "Can you work with the spreadsheet I already have?",
        a: "Yes, and sending it is usually the fastest way to start. Seeing the real file tells me more than a description of it does.",
      },
      {
        q: "My data is messy. Is that a problem?",
        a: "No. Cleaning it is part of the work, and it is one of the most common reasons people get in touch.",
      },
    ],
  },

  {
    slug: "websites",
    title: "Websites",
    tagline: "A site that tells people what you do and how to reach you.",
    icon: "🌐",
    problems: [
      "My website still shows last year's menu",
      "Customers phone to ask things the website should already answer",
      "The site looks wrong on a phone",
      "I do not know who built my site and I cannot get into it",
      "I have no website at all and I am losing work to people who do",
      "I want to change one line of text and I have to ask someone else to do it",
    ],
    deliverables: [
      "A site that works on a phone as well as it does on a computer",
      "Pages for what customers actually ask about: hours, location, prices, contact",
      "A contact form or clear contact details, whichever suits you",
      "Handover notes covering where the site lives and who controls the domain",
    ],
    process: [
      "You tell me what the site needs to do and who it is for",
      "I confirm the pages, what it costs, and how long it takes",
      "I build it and send you a link to review before it goes live",
      "It goes live, and you get everything needed to keep control of it",
    ],
    faqs: [
      {
        q: "Can you update the site I already have?",
        a: "Often, yes. It depends on how it was built and whether you still have access to it. Send me the address and I will tell you what is possible.",
      },
      {
        q: "Will I be able to change the text myself?",
        a: "That is worth deciding before I start, because it changes how the site is built. It is far easier to plan for than to add afterwards.",
      },
      {
        q: "Do I need to buy anything else?",
        a: "A domain name and hosting, both of which are ongoing costs paid to whoever provides them rather than to me. I will tell you what they are before you commit to anything.",
      },
    ],
  },

  {
    slug: "local-tech-help",
    title: "Local Tech Help",
    /*
      The location lives in the tagline because this is the one geographically
      bound service (§11 requires location terms on this page) and the detail
      template builds its meta description from this field. Putting "Calgary"
      in the DATA is what keeps the template generic — the alternative, a
      special case in the JSX for one slug, is exactly what this phase exists
      to avoid.
    */
    tagline: "Get it fixed, upgraded, or built properly, in person around Calgary or remotely.",
    icon: "🖥️",
    /*
      This service covers more ground than the others — diagnosis, hardware
      repair, new builds, software faults, networking, migrations and backups —
      so its `problems` list is longer than the six the other four carry. That is
      the list earning its length, not padding. If it grows much past this,
      splitting the heavier work into its own service line is the better move.
    */
    problems: [
      "I want a computer built for what I actually do, not whatever the shop is selling",
      "It was working fine, then it made a noise and now it will not turn on",
      "It crashes at random and I have been given three different explanations",
      "The program we run the business on stopped working after an update",
      "My computer has got slower every month and I do not know why",
      "It is four years old and I cannot tell whether it is worth fixing or replacing",
      "The printer worked yesterday and today it does not",
      "The Wi-Fi drops out in half the building",
      "I bought a new laptop and everything is still on the old one",
      "I have never backed anything up and I know I should have",
    ],
    deliverables: [
      "A straight answer on what is wrong and what caused it",
      "The repair done, or an honest reason why replacing is the better spend",
      "A computer built and tested to a parts list chosen for your budget and the work you actually do",
      "Your files moved across with nothing left behind",
      "A backup that runs on its own instead of when you remember",
      "Notes on what was changed, so the next person is not guessing",
    ],
    // Worded to cover a build as well as a fault. "Describe what is happening"
    // only makes sense when something is already broken, which is no longer the
    // whole of this service.
    process: [
      "You tell me what is going wrong, or what you want the machine to do",
      "I confirm what I think it is and what it would cost to sort out",
      "I fix it or build it, and show you it working",
      "You get a short note of what was changed and why",
    ],
    faqs: [
      {
        q: "Will I lose my files?",
        a: "Anything involving a transfer or a reinstall starts with a copy of your files, and nothing is erased until you have confirmed the new setup works.",
      },
      {
        q: "I do not know what is actually wrong. Is that a problem?",
        a: "No. Describing what you were doing when it started is enough to go on. Working out the cause is part of the job.",
      },
      {
        q: "Where do you work?",
        a: "I am in Calgary, Alberta, and I work anywhere in the city as well as nearby towns such as Airdrie. Further out is still possible, but the travel time is added to the quote. A lot of problems can also be solved remotely, so ask before assuming you need someone in the room.",
      },
    ],
  },

  {
    slug: "roblox",
    title: "Roblox Development",
    tagline: "Gameplay, UI, and data systems built to survive a live game.",
    icon: "🎮",
    /*
      The one page where jargon is correct (§1). This audience is technical, and
      naming DataStore, session locking and server-side validation is what builds
      credibility here. Do not simplify these into the plain-language register
      used by the other four services.
    */
    problems: [
      "Our DataStore drops player progress and we cannot reproduce it",
      "The game is fine in Studio and falls apart with thirty players in the server",
      "We need a shop and inventory UI and nobody on the team wants to build it",
      "Every new feature breaks two old ones because nothing is modular",
      "Server frame rate collapses the moment a round starts",
      "We shipped an exploit fix and the exploiters were back the same day",
    ],
    deliverables: [
      "Luau modules written to drop into the codebase you already have",
      "DataStore handling with retries, session locking, and schema migration",
      "UI that works across touch, gamepad, and mouse and keyboard",
      "Profiling that names the specific bottleneck rather than a general cleanup",
    ],
    process: [
      "You describe the system and share the place file or repository",
      "I confirm the scope, what it costs, and how long it takes",
      "I build it against your codebase and test it with players in the server",
      "I hand over the code with notes on how it fits together",
    ],
    faqs: [
      {
        q: "Can you work inside our existing codebase?",
        a: "Yes. Most of this work is joining a project that already exists rather than starting from an empty place file.",
      },
      {
        q: "What do you need to give a quote?",
        a: "A description of the system you want, and access to the place file or repository if you have one. Seeing the current structure is what makes an estimate accurate.",
      },
      {
        q: "Can you fix exploits?",
        a: "I can move trusted logic server-side and add validation where the client is currently believed. No one can promise a game is unexploitable, and anyone who does is selling something.",
      },
      {
        q: "Do you use Rojo, or work directly in Studio?",
        a: "Either. I am comfortable with both, so it comes down to what your team already uses.",
      },
    ],

    /*
      THE SECOND ART-DIRECTED PAGE (owner mockup, 2026-08-22). Automation's
      `page` comment above explains the shape and the rules this follows; this
      note only records what is Roblox-specific.

      REGISTER STAYS TECHNICAL, same call as `problems` above and for the same
      reason (§1): this audience reads "Luau" and "DataStore" as credibility,
      not jargon to translate.

      "Get Started" is the template's own hardcoded primary-button label
      (ServiceDetailPage), shared by every service page and left alone here.
      The mockup's second button reads "View My Work" rather than Automation's
      "View Examples" — same destination, `/portfolio`, worded to the mockup.

      THE PROMISE PANEL HAS NO CHECKLIST. The mockup's panel is icon, heading,
      and the Contact Me button — no bullet list under it, unlike Automation's
      three-point one. `points: []` renders the list as empty rather than
      inventing promises the owner never wrote (§11).

      CLOSING BAR COPY ISN'T IN THE MOCKUP (it ends at the process row), so
      this is written to match the register of Automation's own closing copy
      rather than traced from anything — the one piece of this object that is.
    */
    page: {
      headline: [
        [{ text: "Roblox " }, { text: "Development", accent: true }],
        [{ text: "& Game Solutions" }],
      ],
      blurb:
        "Custom Roblox experiences, systems, and assets built with clean code and creative design.",
      secondaryCta: {
        href: "/portfolio",
        label: "View My Work",
        icon: "window",
      },
      offer: {
        label: "What I Offer",
        heading: "End-to-End Roblox Development",
        body: "From game design and systems to custom assets and optimization, I build polished, engaging, and replayable Roblox experiences.",
        cards: [
          {
            icon: "gamepad",
            title: "Game Development",
            description: "Full game creation, systems, and mechanics.",
          },
          {
            icon: "cube",
            title: "Custom Assets",
            description: "Models, animations, and more.",
          },
          {
            icon: "gear",
            title: "Systems & Scripting",
            description: "Clean, scalable Lua code.",
          },
          {
            icon: "users",
            title: "Player Experience",
            description: "Fun, balanced, and polished gameplay.",
          },
        ],
      },
      process: {
        label: "My Process",
        heading: "Build → Test → Deliver",
        body: "I work closely with you to turn ideas into high-quality Roblox experiences, with clear communication and reliable delivery.",
        steps: [
          {
            icon: "chat",
            title: "Plan",
            description: "Discuss ideas, scope and goals.",
          },
          {
            icon: "monitor",
            title: "Develop",
            description: "Build and test with clean code.",
          },
          {
            icon: "rocket",
            title: "Launch",
            description: "Deliver a polished, playable game.",
          },
        ],
      },
      panel: {
        icon: "trophy",
        heading: "Let's build something great together.",
        points: [],
      },
      closing: {
        title: "Have a project in mind?",
        description:
          "Tell me about the system or feature you need. I'll reply within one business day with what it would take.",
      },
    },
  },
];

/*
  Policies that are identical across all five services.

  Kept here rather than copied into each object for the reason this whole phase
  exists: a policy change should be one edit, not five. The detail template
  renders these after the service's own FAQs, so a sixth service picks them up
  automatically without touching anything outside its own object.
*/
export const commonFaqs: { q: string; a: string }[] = [
  {
    q: "Do I pay anything up front?",
    a: "There is a small reservation fee, between $10 and $25 depending on the service, which holds the time in my schedule. The rest is quoted before any work starts, so you always know the number first.",
  },
  {
    q: "How many changes are included?",
    a: "As many as it takes for you to be happy with the result. If the work grows well past what we agreed at the start, I will tell you before I carry on rather than surprising you with a larger bill.",
  },
  {
    q: "What if something goes wrong after you hand it over?",
    /*
      The week runs from delivery to the moment you GET IN TOUCH, not to the
      moment the fix lands. Reporting a problem on day six is covered even if
      sorting it out takes until day nine. Worded that way on purpose — the
      other reading would push people to stay quiet rather than risk being
      told they were too late.
    */
    a: "You have one week from delivery to tell me about anything that is not working, and I will fix it at no extra cost. Anything raised after that week is quoted as new work before I start it.",
  },
  {
    q: "Do I get the files when it is finished?",
    /*
      "Take them to another developer" is the important clause and it is not
      filler. One of the `problems` entries on the websites service is "I do not
      know who built my site and I cannot get into it" — that is a lock-in
      complaint, and a vague ownership answer on the same site would confirm the
      fear rather than settle it. Saying it outright is what makes the rest of
      the page believable.
    */
    a: "Yes. The source files are yours to keep, and you are free to take them to another developer later if you want to. I ask only to be credited as the author of the original work.",
  },
];

/** Lookup for /services/[slug]. Returns undefined for an unknown slug so the
    route can call notFound() rather than rendering a broken page. */
export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** Every slug, for generateStaticParams. Derived from the data rather than
    written out again, so a sixth service is prerendered automatically. */
export const serviceSlugs: ServiceSlug[] = services.map(
  (service) => service.slug,
);

/**
 * The glyph each service's fallback cards are drawn with. Only reached by
 * services that have no `page` of their own — Automation's cards each name
 * their own icon.
 */
const FALLBACK_ICON: Record<ServiceSlug, LineIconKey> = {
  automation: "gear",
  "excel-data": "bars",
  websites: "window",
  "local-tech-help": "monitor",
  roblox: "gamepad",
};

/**
 * The four process icons, in order. The same sequence fits every service's
 * `process` array because all five describe the same shape of job: you show me
 * the problem, I confirm the work, I build it, I hand it over.
 */
const FALLBACK_STEP_ICONS: LineIconKey[] = ["chat", "file", "gear", "plane"];

/**
 * What the page template renders for a service, whether or not it has been
 * art-directed yet.
 *
 * WHY THIS EXISTS. The 2026-08-21 rebuild moved /services/[slug] to the
 * owner's mockup: a split-colour hero with artwork, a card row, a step row,
 * and a closing bar. Automation and, as of 2026-08-22, Roblox have a mockup
 * and owner-written copy for those. The other three still have to render —
 * §15 is explicit that no phase may leave the site half-styled in
 * production — and there are only three ways to do that:
 *
 *   1. keep the old template alive behind a flag, so two layouts ship at once;
 *   2. write new hero copy for three services nobody has approved (§11);
 *   3. build the same layout out of the content those services already have.
 *
 * This is (3). Every string below is either the service's own approved data or
 * a heading already shipping on the previous template — nothing here is
 * invented. The result is visibly plainer than the two art-directed pages,
 * which is accurate: it is plainer, until its own mockup lands.
 *
 * WHAT IS DELIBERATELY MISSING FROM THE FALLBACK. No `panel` — its three
 * points are promises about how the work goes, and there is no approved list
 * of those for the other services. An empty panel or a guessed one are both
 * worse than the template simply not drawing it.
 */
export function servicePage(service: Service): ServicePage {
  if (service.page) return service.page;

  const icon = FALLBACK_ICON[service.slug];

  return {
    headline: [[{ text: service.title }]],
    blurb: service.tagline,
    secondaryCta: { href: "/portfolio", label: "View Examples", icon: "window" },
    offer: {
      label: "What I build",
      // Both headings below are the previous template's, verbatim — approved
      // copy that already described exactly these two lists.
      heading: "What you actually receive",
      cards: service.deliverables.map((deliverable) => ({
        icon,
        title: deliverable,
      })),
    },
    process: {
      label: "My process",
      heading: "From first message to finished",
      steps: service.process.map((step, index) => ({
        icon: FALLBACK_STEP_ICONS[index % FALLBACK_STEP_ICONS.length],
        title: step,
      })),
    },
    // CTASection's own defaults, spelled out here so the closing bar has one
    // source of copy rather than half of it coming from a component default.
    closing: {
      title: "Tell me what you're trying to get done",
      description:
        "Describe the problem in plain words. I'll reply within one business day with what it would take.",
    },
  };
}
