import type { ElementType, ReactNode } from "react";

/*
  The signature element of the "marked up" direction: a short orange rule above
  a small tracked label. Used to title sections and footer columns.

  The rule is graphic orange (#ff481f), which is legal only because it is a
  non-text element — the label below it is ink. See the contrast note in
  globals.css before using that colour anywhere else.
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
      <span aria-hidden="true" className="block h-0.5 w-8 bg-accent-graphic" />
      <Label id={id} className="mt-3 text-eyebrow uppercase text-ink">
        {children}
      </Label>
    </div>
  );
}
