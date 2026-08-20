import type { ElementType, ReactNode } from "react";

/*
  A short rule above a small tracked label. Used to title sections and footer
  columns.

  Neutral, not accent. §9.2 reserves orange for actions and current state —
  this rule sits above section labels site-wide and is never clickable, so it
  uses --border rather than --accent. (The old light/dark version of this
  component used the accent here as a documented one-mark-per-page exception;
  the redesign doc restates §9.2 without that carve-out, so this phase drops
  it rather than assume it still applies.)
*/

interface EyebrowProps {
  /** Use a heading element when this titles a section; defaults to a paragraph. */
  as?: ElementType;
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function Eyebrow({
  as: Label = "p",
  id,
  children,
  className = "",
}: EyebrowProps) {
  return (
    <div className={className}>
      <span aria-hidden="true" className="block h-0.5 w-8 bg-border" />
      <Label id={id} className="mt-3 text-eyebrow uppercase text-text">
        {children}
      </Label>
    </div>
  );
}
