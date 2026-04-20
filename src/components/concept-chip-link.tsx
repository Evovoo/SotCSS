"use client";

import { MouseEvent, ReactNode } from "react";
import { useConceptDrawer } from "@/components/concept-drawer";

type ConceptChipLinkProps = {
  href?: string;
  children: ReactNode;
};

export function ConceptChipLink({ href, children }: ConceptChipLinkProps) {
  const { openConcept } = useConceptDrawer();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href) {
      return;
    }

    event.preventDefault();
    openConcept(href);
  }

  return (
    <a className="concept-chip" data-concept-link="true" href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
