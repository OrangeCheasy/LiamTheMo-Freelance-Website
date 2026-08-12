import type { ElementType, ReactNode } from "react";

/*
  The signature element of the "marked up" direction: a short coral rule above a
  small tracked label. Used to title sections and footer columns.

  The rule uses the dusty accent, not the pastel. A pastel hairline on a light
  surface measures about 1.5:1 and is effectively invisible — see the contrast
  note in globals.css.
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
      <span aria-hidden="true" className="block h-0.5 w-8 bg-accent" />
      <Label id={id} className="mt-3 text-eyebrow uppercase text-ink">
        {children}
      </Label>
    </div>
  );
}
