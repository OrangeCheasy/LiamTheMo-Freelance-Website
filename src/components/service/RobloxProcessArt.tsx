import Logo from "@/components/Logo";
import { warmGlowImage } from "@/lib/glow";

/*
  The artwork beside the Roblox page's process steps (owner mockup,
  2026-08-22): the same tree-lined, portal-lit scene as RobloxHeroArt, cropped
  to the archway and carrying the site's own "lm" mark glowing inside it
  rather than a character.

  WHY IT EARNS ITS PLACE — same reasoning as AutomationProcessArt: the step
  row next to it says what the process is; this is the payoff, a finished
  place with the maker's own mark lit up inside it, standing in for "a
  polished, playable game" the way AutomationProcessArt's finished run stands
  in for "a documented system."

  SHARES ITS SHAPES WITH RobloxHeroArt (tree silhouette, archway) rather than
  duplicating the scene as a second drawing — it is the same place, seen
  closer up, so it is built the same way rather than redrawn.

  SAME RULES AS EVERY OTHER SERVICE-PAGE ARTWORK: DOM rather than an image,
  aria-hidden because it is set dressing, no animation.
*/

function TreeSilhouette({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute bottom-0" style={style}>
      <div className="relative h-full w-full">
        <div
          className="absolute bottom-0 left-1/2 h-[45%] w-[18%] -translate-x-1/2 rounded-[0.15em]"
          style={{ background: "var(--color-border)" }}
        />
        <div
          className="absolute bottom-[30%] left-0 h-[70%] w-full rounded-full border"
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
          }}
        />
      </div>
    </div>
  );
}

export default function RobloxProcessArt({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border ${className}`}
      style={{
        backgroundImage: [
          warmGlowImage({ size: [65, 80], peak: 28, at: "50% 88%" }),
          "linear-gradient(180deg, color-mix(in srgb, var(--color-service-roblox) 12%, var(--color-bg)) 0%, var(--color-bg) 55%, var(--color-surface-2) 100%)",
        ].join(", "),
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[18%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--color-surface-2))",
        }}
      />

      <TreeSilhouette
        style={{ left: "4%", width: "16%", height: "40%", opacity: 0.5 }}
      />
      <TreeSilhouette
        style={{ right: "5%", width: "18%", height: "46%", opacity: 0.6 }}
      />

      {/* The archway, centred, with the "lm" mark glowing inside it. */}
      <div
        className="absolute bottom-[10%] left-1/2 flex w-[42%] -translate-x-1/2 items-center justify-center rounded-t-[999px] border border-border"
        style={{
          height: "62%",
          background: `${warmGlowImage({ size: [80, 100], peak: 60, at: "50% 100%" })}, var(--color-surface-2)`,
          boxShadow:
            "0 0 2.5em color-mix(in srgb, var(--color-accent) 35%, transparent)",
        }}
      >
        {/* The glow the mockup lights this mark with — a filter on a
            wrapping element, since it has to trace the mark's own path
            rather than fill a box the way warmGlowImage() does. */}
        <div
          className="h-[34%]"
          style={{
            filter:
              "drop-shadow(0 0 0.5em color-mix(in srgb, var(--color-accent) 80%, transparent))",
          }}
        >
          <Logo className="h-full w-auto text-accent" />
        </div>
      </div>
    </div>
  );
}
